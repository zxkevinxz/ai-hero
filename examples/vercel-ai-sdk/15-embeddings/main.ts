import {
  cosineSimilarity,
  embed,
  embedMany,
} from "ai";
import { smallEmbeddingModel } from "../../_shared/models.ts";

/**
 * We use an embedding model, which is a model that converts
 * a string into a vector.
 */
const model = smallEmbeddingModel;

/**
 * Here, we're creating a very small vector database, where
 * we're embedding the words "Dog", "Cat", "Car", and "Bike".
 */
const values = ["Dog", "Cat", "Car", "Bike"];

const { embeddings } = await embedMany({
  model,
  values,
});

const vectorDatabase = embeddings.map(
  (embedding, index) => ({
    value: values[index],
    embedding,
  }),
);

/**
 * We then create a target embedding for the word "Canine".
 */
const searchTerm = await embed({
  model,
  value: "Canine",
});

/**
 * We then calculate the cosine similarity between the target,
 * using cosineSimilarity from the "ai" package.
 */
const entries = vectorDatabase
  .map((entry) => {
    return {
      value: entry.value,
      similarity: cosineSimilarity(
        entry.embedding,
        searchTerm.embedding,
      ),
    };
  })
  .sort((a, b) => b.similarity - a.similarity);

/**
 * We can see that the distances are as follows (with my
 * local model):
 *
 * [
 *   { value: 'Dog', similarity: 0.891_808_583_453_986_2 },
 *   { value: 'Cat', similarity: 0.591_199_759_841_512_7 },
 *   { value: 'Car', similarity: 0.556_441_513_872_631_7 },
 *   { value: 'Bike', similarity: 0.500_282_996_939_277_7 }
 * ]
 *
 * This indicates that Dog is the most similar to Canine, and
 * Bike is the least similar.
 */
console.dir(entries, {
  depth: null,
  numericSeparator: true,
});
