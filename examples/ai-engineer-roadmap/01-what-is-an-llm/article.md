# What Is a Large Language Model?

A large language model is a computer program you can run on your machine, or on the cloud.

It's composed of two parts, which I'll explain with some pseudocode. It's essentially a variable, and a function.

## Parameters

The variable is the parameters of the model. This is the "knowledge" the model has learned from the data it was trained on.

```ts
// All the parameters of the model,
// possibly 7, 65 or 200 billion of them
// Each parameter is a single number:
const parameters = [
  1.12387123871623, 5.5912398123123, 0.12387123871623,
  7.12890389716238, 2.19819827,
];
```

These parameters are the result of training the model on a large dataset. A rough guide is to take a chunk of the internet, let's say 10TB of data. You use 6,000 GPU's for 12 days, at the cost of around $2M. And you end up with a ~140GB file with all the parameters of the model. Thanks to [Andrej Karpathy](https://www.youtube.com/watch?v=zjkBMFhNj_g) for the numbers.

You end up with a huge file of parameters - a kind of 'compressed' version of all of the data the model was trained on.

It's possible (though very difficult) to dive into these parameters to work out which parameters correspond to which real-world concepts. For instance, Anthropic found the parameters in their model which correspond to the ["Golden Gate Bridge"](https://www.anthropic.com/news/golden-gate-claude). For 24 hours, they released a version of Claude which only talked about the Golden Gate Bridge.

## Inference

The 'function' part is the way we run the model. This is the code that takes in some input, and uses the parameters to generate an output.

```ts
// The function that runs the model
function runModel(input) {
  // ...
}
```

This is called model inference - the process of running the model on a given input. Startups like [Groq](https://groq.com/) promise fast inference on existing models.

## How Do LLM's Work?

## What Is Model Training vs Model Inference?

Model training is the process of building the set of parameters that define the model. Model inference is the process of _running_ the model on a given input.

Training models (often called pre-training) is an incredibly involved process. It requires a lot of data, a lot of compute power, and a ton of expertise. There are very few people in the world who know how to do it well, and they all work at model providers like OpenAI, Google, Anthropic and Deepseek.

Inference is simply the act of running the model on a given input. This is much cheaper, and depending on the size of the model can be done on your laptop.

## Parameter Size

"To make the most out of the machines, most people choose the largest models that can fit in their machines. Most GPUs come with 16 GB, 24 GB, 48 GB, and 80 GB memory. So it's not a coincidence that many models today have 7 billion or 65 billion parameters - these models fit neatly into the memory of the most common GPUs." - Chip Huyen

The speed a model runs at really depends on its number of parameters. A 7B parameter model will run around 10x faster than a 70B parameter model.

## Tokens
