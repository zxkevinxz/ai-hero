We've now got Evalite set up so that it can run evals for us. But what evals should we run?

To know what evals we need to run, we need to understand what we are evaluating for. What does success look like in our application?

Clearly defining success criteria is enormously important for any AI engineering project. These success criteria give you a bar to clear - something to aim for.

## How do you create success criteria?

The best place to start is to imagine your ideal user. What do they want when they use your app?

In the case of a DeepSearch app, they are looking for an answer to their question. They need that answer to be:

- Factual - a correct answer to their question
- Relevant - the app should not veer off and answer some different question
- Sourced - the app should use sources in its answer, and provide those sources to the user
- Up to date - the app should use the most recent information available
- Fast (ish) - the app should return an answer in a reasonable time frame

Each of these metrics will form the basis of how well we think our application is doing.

Crucially, instead of a pass/fail grade, good success criteria score these metrics on how often they are met.

For example, we should try to return a factual result 85% of the time, under 30 seconds for 90% of queries, and so on.

## How do you pick the scores you go for?

The scores that you pick should be based on a cost-benefit analysis of how much performance matters to your application.

For example, if your application is a question-answerer based on legal documents, any factual error from your system becomes extremely costly. Let's say you charge a subscription for your services. If the user encounters a factual error, they may cancel their subscription - costing you the revenue from that user.

However, in a more general-purpose, low-stakes application, users may have a slightly higher tolerance for innacuracies. In this case, you may be able to get away with a lower factual accuracy score.

## Why not aim for 100%?

It's tempting to ask why not aim for 100% in all of our metrics? 100% accuracy, as fast as possible.

The first reason is that 100% is often impossible to achieve. LLMs are probabilistic systems; they will never work deterministically - and a deterministic system is really the only way you're going to get 100% accuracy.

The other reason is that the closer you get to 100%, the harder improvements become. Getting to 50% accuracy is easy. Getting to 80% is harder. 90% is very hard, and 95% is almost impossible.

At some point, you need to work out the costs of continuing to push up that hill.

---

In traditional software engineering, your success criteria are fairly obvious: "Does the app work?". "Do the users use it?"

But in AI engineering because LLMs are so probabilistic, the app likely won't work 100% of the time. In our deep search implementation.

If you think about it, these would be the same metrics you would want from a general-purpose search engine. There's nothing particularly novel about the fact we're using AI here.
