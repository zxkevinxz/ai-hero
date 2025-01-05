An example of using a LLM to generate an enum using Vercel's AI SDK.

Start with [./generate-enum.ts](./generate-enum.ts).

## Description

Another classic use case for LLMs is classification.

Let's say we want to pass a user comment to the LLM to classify as `positive`, `negative`, or `neutral`.

We want to get back from the LLM essentially one string, and that string is going to be either `positive`, `negative`, or `neutral`.

In traditional software parlance, this is called an enum — a set of enumerated values.

And we can use the AI SDK to generate that enum.

```ts
export const classifySentiment = async (text: string) => {
  const { object } = await generateObject({
    model,
    output: "enum",
    enum: ["positive", "negative", "neutral"],
    prompt: text,
    system:
      `Classify the sentiment of the text as either ` +
      `positive, negative, or neutral.`,
  });

  return object;
};
```

We're using the `generateObject` function again, but this time we're passing an output of `enum`.

We also pass an `enum` property with an array of the possible strings we want it to return.

The result we get back from `generateObject` has an object's property, and that object is our enum.

Let's try out a few different statements to see if it works:

```ts
const result = await classifySentiment(
  `I'm not sure how I feel`,
);

console.log(result);
```

`I'm not sure how I feel` comes out as `neutral`.

```ts
const result = await classifySentiment(`This is terrible`);

console.log(result);
```

`This is terrible` comes out as `negative`.

```ts
const result = await classifySentiment(`I love this`);

console.log(result);
```

And `I love this` comes out as `positive`.

And just like that, we've got a sentiment analysis system. This is a really cool use case for enums, and it's great that the AI SDK makes it so simple.
