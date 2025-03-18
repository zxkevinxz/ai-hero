---
slug: what-are-evals
---

As we saw [last time](https://aihero.dev/how-to-choose-an-llm), the only reasonable way to evaluate an LLMs suitability for your application is to test it in situ.

How do you know if your AI application is hallucinating? How do you ensure it's outputting what you want it to? How do you ensure it stays secure? How do you test it against different models?

The answer is evals. Evals are the AI engineer's unit tests. They are how you wrangle predictability from a probabilistic system. They are an indispensable part of productionizing any AI app.

Let's break down what evals are, and why AI apps need them so badly.

## In AI Apps, No Change Is Small

All AI systems are subject to the butterfly effect. Tiny changes in a prompt, user input or the underlying model can result in enormous deltas in output.

Normal software is deterministic. The relationship between the inputs (the code) and the outputs (the behavior of the software) is often straightforward. Each part of the codebase has its own domain of responsibility.

```mermaid
flowchart
  A("App Menu Code") --> AB("App Menu")
  B("Sign Up Form Code") --> BB("Sign Up Form")
  C("Password Checker Code") --> CC("Password Checker")
```

Let's say you capitalize a single word in an app menu. You can be fairly confident in the outcome of that change. The dependencies between your code and its output are clear.

But capitalizing a single word in a prompt can create massive ripple effects.

The dependencies in an AI system are totally inscrutable. Every input is fed into a black box, which only then produces an output.

```mermaid
flowchart
  Instructions
  Examples
  TD["Training Data"]
  LLM
  Output

  Instructions --> LLM
  Examples --> LLM
  TD["Training Data"] --> LLM
  LLM --> Output
```

In AI systems, no change is small. Their attention and transformation mechanisms are inscrutable. Whether the butterfly "flaps" or "Flaps" its wings may change the output. To put it mildly, building robust systems with them requires care.

## "Vibes-only" Is A Killer

It's easy to get an impressive AI demo working quickly. You try a prompt. You add some exemplars of your desired output. You pull in some chain-of-thought. It clicks, and your system starts working. You've produced a tool of genuine value.

Time to get it into production. QA takes a hatchet to your system, and finds several bugs. You push a commit to fix the bugs. But the bugfix produces other bugs. Each commit seems to make the system worse.

Perhaps the problem is the model. You switch from GPT-4o to Claude. Your output improves. The vibes are good. But new bugs appear. Perhaps the system makes its way into production. 6 months down the line, the app becomes unusably buggy. The underlying model changed, and you didn't know until your users told you.

A "Manual QA-only" approach in deterministic software is usually doable. You say "I added a new page" and the QA team can rigorously test the new page, and smoke test the previous pages.

But in probabilistic systems, it is a killer. When any change can affect the entire system, how do you make progress?

## Evals

The key is automation. We need to evaluate our app every time we make a change, or every time the underlying model changes.

### Traditional, Deterministic Systems

In deterministic systems, automating testing is relatively straightforward. You can feed some inputs in and check the outputs.

```ts
const output = myNormalSystem(input);

// Will fail if the output doesn't match
assert(output === "my-desired-output");
```

These assertions are 'pass' or 'fail'. And usually, an app has to pass every test to be considered production-ready.

### Probabilistic Systems

But writing these tests for AI isn't as straightforward.

Let's say your app generates written articles. You want to check that the output is good enough for production. You might need to write assertions for:

- **Factuality**: checking if all statements in the output are factually correct
- **Writing style**: ensuring that the text is elegant and well-written
- **Prompt fidelity**: ensuring that the output actually corresponds to what the user asked.

These are qualitative metrics. Instead of a pass/fail, they need to be represented by a _score_. Each time you change your app, you need to know if it made the system 5% better, or 50% worse.

This is what evals do - they give you a score you can use to see how well your AI system is performing.

## Three Types Of Evals

Evals come in many shapes and sizes.

### Deterministic Evals

There are **deterministic evals**, which can be written as simple assertions.

```ts
const article = writeArticleWithLLM(prompt);

// Article should be more than 300 words long
assert(article.length >= 300);

// Article should be less than 2,000 words long
assert(article.length <= 2000);
```

These are traditional pass/fail checks. You would pass a wide variety of prompts into your system, and check each time if they pass these tests.

They're simple to write, but only cover a subset of what you want to evaluate.

### Human Evaluation

For more probabilistic metrics, you have two choices.

You can use human evaluation to check whether your system is performing correctly. This is often your only choice early on, when you don't have a lot of data.

This is expensive, and time consuming - but all AI systems will rely on human input to some extent.

### LLM As A Judge

Another technique is to pass the results of your prompts into another LLM, and use that **LLM as a judge**. This is currently a very fashionable way to evaluate AI systems.

Let's imagine you may want to make sure your app is telling the truth. You can do that by passing your system's output into a LLM, along with some ground truth.

```mermaid
flowchart
  B("`**Question**: What is the
  capital of France?`")
  A("`**Our Output**: The Capital
  Of France Is Paris`")
  D("`**Truth**: Paris is
  France's Capital`")
  C("LLM")
  E("`**Score**: 100%`")

  B --> C
  D --> C
  A --> C
  C -- Produces --> E
```

An example of this in action can be found on the [Evalite](https://www.evalite.dev/guides/scorers#creating-llm-as-a-judge-scorers) docs.

LLM-as-a-judge makes certain evaluations possible - but at a cost. Running LLMs are expensive, so you need to think carefully about what cadence you run them at. Running your evals every time your files change, for example, would be prohibitively expensive.

Common strategies include splitting your evals into two sets - a smaller group for local testing, and a larger group to be run daily.

## The Full Picture

Imagine an eval kind of like a function:

```ts
const score = runEval({
  // 1. The prompts we'll test with
  data: [
    "Fish species in the Mediterranean",
    "Story of the first Moon landing",
    "Are Krakens real?",
  ],
  // 2. A function to generate outputs based
  // on our prompts
  task: async (topic) => {
    return generateArticle(topic);
  },
  // 3. The scorers we'll use to generate
  // the final score
  scorers: [
    // Checks if output is long enough
    length,
    // Uses an LLM to check if it's accurate
    factualAccuracy,
    // Uses an LLM to check writing style
    writingStyle,
  ],
});

// 4. A score between 0-100%
console.log(score);
```

We pass in a set of prompts (1), then the task to run (2), then the methods we're using to score our output (3).

Finally, we get back a score on how well our function performed (4).

This, at its heart, is what an eval is. This API is loosely inspired by Braintrust's [autoevals library](https://github.com/braintrustdata/autoevals).

## How Do I Improve My Evals Over Time?

Your evals are the method by which you monitor and improve your AI system. This also means that the dataset you use to evaluate your system is crucial.

You need to make sure that your evals are representative of the data your system will see in production. If you're building a classifier, you need to make sure your evals cover all the edge cases your system will see.

This means it's crucial to build in observability and feedback systems into your application. Once your app is deployed, your users will be the judge of whether your system is working or not. Simple feedback buttons, like upvotes and downvotes, can give you extremely valuable insights into how your system is performing.

### The Data Flywheel

Vercel, creators of [v0](https://v0.dev/), have written about the [AI Native Flywheel](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#the-ai-native-flywheel). They describe the importance of evals in the AI development process.

The best data for your evals comes from your users. By carefully monitoring how users are using your app, you can build a feedback loop that will help you improve your system over time. Let's take an example:

- A user asks your app "build me a classy React application"
- Your app generates a React app. But instead of making the UI look "classy", it uses classes in the code.
- The user downvotes the response. Perhaps they even leave a comment explaining why.
- You take the prompt "build me a classy React application", and create a new eval for it. You add it to your eval suite.
- You improve the system until it passes the eval.
- You re-deploy. The next time a user hits this prompt, they get a better response.

This is the data flywheel in action. By carefully monitoring your system, and building in feedback loops, you can ensure your system is always improving.

## How Do I Run Evals?

There are many methods for running evals. A large number of startups have entered the space, offering tools to run your evals and view them online.

## Your App Is Only As Good As Its Evals

So, to summarize:

- AI programs are highly sensitive to small changes.
- Continuous monitoring is required to know whether your app is getting better or worse.
- To run an eval, you take a `task`, pass it some `data`, and check the outputs using `scorers`. This generates a score between 0 and 100.
- You can run these evals after every change, or to evaluate new models, to get a qualitative metric on your system.

They are the essential tool of any AI developer. Without this continuous feedback loop, your AI app will become impossible to change.
