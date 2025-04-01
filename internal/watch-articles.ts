import { watch } from "chokidar";
import frontMatter from "front-matter";
import { glob, readFile } from "fs/promises";
import path from "path";

if (!process.env.AI_HERO_TOKEN) {
  throw new Error("AI_HERO_TOKEN is required");
}

export const fetchFromAiHero = async (
  path: string,
  init?: Omit<RequestInit, "headers">,
) => {
  const result = await fetch(
    `https://www.aihero.dev/api${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${process.env.AI_HERO_TOKEN}`,
      },
    },
  );

  if (!result.ok) {
    console.error(result.status, result.statusText);
    console.dir(await result.json(), { depth: null });
    throw new Error(result.statusText);
  }

  return await result.json();
};

const fileLocations = [
  path.join(process.cwd(), "examples", "**/*.md"),
  path.join(process.cwd(), "courses", "**/*.md"),
];

const files = await Array.fromAsync(
  glob(fileLocations),
);

const watcher = watch(files, {
  ignoreInitial: true,
});

watcher.on("all", async (eventName, filePath) => {
  // Ignore unlink events and directory events
  switch (eventName) {
    case "unlink":
    case "addDir":
    case "error":
    case "unlinkDir":
      return;
  }

  const fileContents = await readFile(
    filePath,
    "utf-8",
  );

  const fm = (
    frontMatter as unknown as typeof frontMatter.default
  )(fileContents);

  const attributes = fm.attributes as {
    id?: string;
    slug?: string;
  };
  const id = attributes?.id;

  if (!id) {
    if (attributes.slug) {
      console.log(
        `⚠️  No 'id' found in frontmatter. https://aihero.dev/${attributes.slug}/edit`,
      );
    }
    return;
  }

  try {
    const post: {
      fields: { title: string; slug: string };
    } = await fetchFromAiHero(
      `/posts?slugOrId=${id}`,
      {
        method: "GET",
      },
    );

    console.log(`📝 ${post.fields.slug} changed`);

    await fetchFromAiHero(`/posts?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        fields: {
          slug: post.fields.slug,
          title: post.fields.title,
          body: fm.body.trim(),
        },
      }),
    });

    console.log(
      `📝 Updated: https://aihero.dev/${post.fields.slug}`,
    );
  } catch (error) {
    console.error(error);
  }
});
