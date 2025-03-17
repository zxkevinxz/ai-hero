```mermaid
flowchart
  D(Pre-Training Data)
  M(Model)
  P(Parameters)
  IN(Interpretability)
  I(Inference Engine)
  PR(Pre-Training)
  T(Completion Tokens)
  TEXT(Text Input)
  TOK(Tokenizer)
  INP(Input Tokens) -- Passed To --> I

  TEXT -- Fed Into --> TOK
  TOK -- Produces --> INP
  IN -- Used To Introspect --> M
  D -- Fed Into --> PR
  PR -- Used to acquire --> P
  P -- Forms the 'brain' of --> M
  I -- Generates --> T
  M -- Used To Run --> I
```

In this article, we'll cover the basics of large language models. We'll talk about what they are, how they work, and touch on the process of creating them.

Most of the resources out there go really deep into how LLM's work - we're not going to do that. Instead, I'll give you a brief overview of the most common concepts so you can go ahead and get building.

## What Is A Large Language Model?

```mermaid
flowchart
  P(Parameters)
  M(Model)

  P -- Forms the 'brain' of --> M
```

A large language model is a single massive file. This file contains a bunch of numbers, encoded as 16-bit floats. These numbers are the _parameters_ of the model.

```txt
0.123978487123876123
0.1515689756890123123
```

These numbers represent the 'brain' of the model. They are the result of the model's pre-training: a process that takes a huge amount of text data and 'compresses' it (to use Andrej Karpathy's analogy) into these numbers.

The number of these parameters represents the size of the model's brain. In general, models with larger brains perform better, but run slower. A model with 70B parameters will run ~10x slower than a model with 7B parameters.

## How Do You Run A Large Language Model?

```mermaid
flowchart
  M(Model)
  I(Inference Engine)
  T(Completion Tokens)
  INP(Input Tokens) -- Passed To --> I

  M -- Used To Run --> I
  I -- Generates --> T
```

In order to get the model to do anything useful, you need to perform _inference_ on the model.

Inference is the process of sending text to the model and getting a response back. This is done using an _inference engine_ - a piece of software that takes the parameters of the model and runs an algorithm on them to find the next word. This is far cheaper than pre-training the model, and can be done on your laptop.

The text is not sent to the model as is. It is first _tokenized_ into a series of numbers. These numbers are then sent to the model as _input tokens_. We'll talk about that more in a minute.

Explaining how inference works is outside the scope of this article. But in general, you send input tokens to the model, and it returns 'completion tokens' back to you. Startups like [Groq](https://groq.com/) promise fast inference on existing models.

## What Are Input And Completion Tokens?

```mermaid
flowchart
  TEXT(Text Input)
  TOK(Tokenizer)
  INP(Input Tokens)

  TEXT -- Fed Into --> TOK
  TOK -- Produces --> INP
```

When you send text to the model, it first needs to be tokenized. This is the process of breaking the text up into individual words, and then converting those words into numbers. These numbers are the input tokens, which are passed to the inference engine.

Each model has its own tokenizer. [Tiktokenizer](https://tiktokenizer.vercel.app/) is a great playground for exploring different tokenizers.

## How Do You Create A Model?

```mermaid
flowchart
  D(Pre-Training Data)
  P(Parameters)
  PR(Pre-Training)

  D -- Fed Into --> PR
  PR -- Used to acquire --> P
```

In order to acquire the parameters, you need to train the model. Training large language models is an extremely involved process that requires a lot of time, expertise, and money. Learning how to do it is outside the scope of this article.

A rough guide is to take a chunk of the internet, let's say 10TB of data. You use 6,000 GPU's for 12 days, at the cost of around $2M. And you end up with a ~140GB file with all the parameters of the model.

```mermaid
flowchart
  C("Training Data (10TB)")
  PR("6000GPU's for 12 days ($2m)")
  P("140GB of Parameters")

  C -- Fed Into --> PR
  PR -- Used to acquire --> P
```

You end up with a huge file of parameters - a kind of 'compressed' version of all of the data the model was trained on.

## How Do You Introspect A Model?

```mermaid
flowchart
  M(Model)
  IN(Interpretability)

  IN -- Used To Introspect --> M
```

It's possible (though very difficult) to dive into the parameters of a model to work out which ones correspond to which real-world concepts. For instance, Anthropic found the parameters in their model which correspond to the ["Golden Gate Bridge"](https://www.anthropic.com/news/golden-gate-claude). For 24 hours, they released a version of Claude which only talked about the Golden Gate Bridge.

<!-- What are the hardware requirements for running inference on our local machines? -->
