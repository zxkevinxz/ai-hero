---
id: lesson-rludz
---

We've now got Evalite set up so that it can run evals for us. But what evals should we run?

To know what evals we need to run, we need to understand what we are evaluating for. What does success look like in our application?

## How do you create success criteria?

The best place to start is to imagine your ideal user. What do they want when they use your app?

In the case of a DeepSearch app, they are looking for an answer to their question. They need that answer to be:

- Factual - a correct answer to their question
- Relevant - the app should not veer off and answer some different question
- Sourced - the app should use sources in its answer, and provide those sources to the user
- Up to date - the app should use the most recent information available
- Fast (ish) - the app should return an answer in a reasonable time frame

Each of these metrics will form the basis of how well we think our application is doing.

Crucially, instead of a pass/fail grade, good success criteria score these metrics on how often they are met. We can then aim to improve the application over time.

### Business metrics

Separately from our evals, we also need to keep an eye on metrics relevant for our business.

- Cost per query: the amount we pay for each query
- Cost per user: the amount each user costs us per month
- Conversion rate: the percentage of users who convert to paying customers

We can't evaluate these in our evals, but we should bear them in mind for our success criteria.

### Error metrics

## What constitutes a 'good' score?

It's one thing to define your success metrics. It's another to say whether you've passed or failed them. At a simple level, you want to see the numbers go up over time. But it can be tempting to pick a number ahead of time to aim for - like 'factual accuracy' of 90%.

Indeed, there are certain situations where you will _need_ to pick a number. If you're running an agency and bidding for a project, metrics like 'factual accuracy' will be as important as 'uptime'.

### Establish a Baseline

In situations where you need to pick a number, establishing a baseline is very useful. For a DeepSearch application like ours, try testing similar implementations. Track how often they get the answer right, and use that as your baseline.

In the real world, the baseline might be human performance. Let's say you're building an internal HR chatbot. You could track how long it takes for users to answer a question, and how often they get the right information, and use that as your baseline.

Instead of promising numbers, "beating the baseline" is a much more useful framing for success criteria. This lets you promise an improvement to the company, and then track that over time.

## Success criteria impacts your system design

I've described elsewhere the [staircase of complexity](https://www.aihero.dev/how-to-improve-your-llm-powered-app). It's a staircase you descend as you add more complexity to your application.

At the bottom of the staircase are extremely complex, extremely costly techniques like fine-tuning. At the top are simpler techniques, like zero-shot prompting or adjusting temperature.

How you define your success criteria will tell you how far you need to go down that staircase. For example, if the domain you're in demands high factuality, you'll need to go pretty deep. But if your application only writes tweets or summarizes content, you can get away with a simpler approach.
