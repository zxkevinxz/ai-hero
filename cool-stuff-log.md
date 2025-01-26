How do you count how many tokens are in a text file?

---

How do you evaluate your embedding model?

---

https://www.pinecone.io/learn/chunking-strategies/

---

https://research.trychroma.com/evaluating-chunking

---

Evaluating the performance of agents is still an open question.

Agents have new modes of operation and so will have new modes of failures.

---

Agents often need to perform multiple steps to accomplish a task. And the accuracy decreases as the number of steps increases.

If the model's accuracy is 95% per step over 10 steps, the accuracy will drop to 60%.

---

There's an interesting distinction between read-only tools and write tools. Both are important, but of course, I think that `Human in the loop` should be used for write tools.

---

Experimentation is necessary to find the right set of tools.

---

There are three categories of tools to consider:

1. Knowledge augmentation - adds things to the context so the `LLM` can do more things.

2. Capability extension - allows it to execute code or understand its environment better. AI models are notorious for being bad at maths. So providing the ai model with a calculator is very useful.

Unit converters, calendars, time zone converters are also very useful.

External tools can also make a text-only model multimodal. For instance, a model can generate texts, PDFs, or files.

This is how `ChatGPT` can generate both text and images. It uses `DALL-E` as its image generator.

Agents can use image captioning tools to process images. They can use OCR to read PDFs. They can use transcription tools to process audio.

3. Tools that let your agent act upon its environment.

Sql executors can retrieve a data table, But also write to the database. Email Apis can read emails, but also respond to them. Banking apis can retrieve your current balance, but also initiate a new transfer.

---

The idea of web browsing is to make sure the models data doesn't go stale. Web browsing can allow your agent to reference up to date information, but select your Internet APIs with care. You can also open up your agent to the worst parts of the Internet.

---

Every agent should use a planning process. The output of the planning process is a plan - A roadmap outlining the steps needed to accomplish a task.

You often want the model to consider the task, consider the different options to achieve the task and choose the most promising option.

As an important computational problem, planning is very well studied.

---

Planning should be decoupled from execution. You should create a chain where the first call creates the plan, and then only after the plan is validated is it then executed.

Validating the plan is really important. You can validate the plan using heuristics. For example, one simple heuristic is to eliminate plans with invalid actions. If the plan requires a `Google` search and the agent doesn't have access to a `Google` search, the plan is invalid.

Your system can have three components. One generates plans, one validates plans, and the other executes the plan.

---

You can generate several plans in parallel and ask the evaluator to pick the most promising one. This is a latency cost trade off.

---

Using an intent classifier can often help agents plan.

The intent classifier should be able to classify requests as irrelevant, so that the agent can refuse those, instead of wasting time coming up with impossible solutions.

---

https://platform.openai.com/docs/guides/prompt-engineering

---
