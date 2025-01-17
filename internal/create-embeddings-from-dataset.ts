import { embedMany } from "ai";
import { readFileSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { lmstudio } from "../examples/_shared/models.ts";

const embeddingModel = lmstudio.textEmbeddingModel("");

const embedContent = async (contentDir: string) => {
  const contentFiles = (await readdir(contentDir))
    .filter((relativePath) =>
      relativePath.endsWith(".md"),
    )
    .map((filePath) => path.join(contentDir, filePath))
    .flatMap((absoluteFilePath) => {
      const rawContent = readFileSync(
        absoluteFilePath,
        "utf-8",
      );

      const lines = rawContent.split("\n");

      lines.shift(); // Remove the title

      const [questions, answer] = lines
        .join("\n")
        .split("# Answer")
        .map((section) => section.trim());

      return questions!.split("\n").map((question) => {
        return {
          question: question.trim(),
          answer: answer!,
        };
      });
    });

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: contentFiles.map(
      ({ question }) => question,
    ),
  });

  const vectorDatabase = contentFiles.map(
    ({ answer, question }, index) => ({
      answer,
      question,
      vector: embeddings[index]!,
    }),
  );

  return vectorDatabase;
};

const datasetBase = path.join(
  import.meta.dirname,
  "../datasets",
);

const datasets = await readdir(datasetBase);

for (const dataset of datasets) {
  const vectorDatabase = await embedContent(
    path.join(datasetBase, dataset),
  );

  writeFileSync(
    path.join(datasetBase, dataset, `embeddings.json`),
    JSON.stringify(vectorDatabase, null, 2),
  );

  console.log(
    `Vector database for ${dataset} has been created`,
  );
}
