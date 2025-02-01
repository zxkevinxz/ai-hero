<!--
This acts as an unstructured log for everything I'm
currently reading. It's a single entrypoint for all
observations which I can later sort into more structured
notes and course content.

This is the top of the funnel, folks.
 -->

How do you count how many tokens are in a text file?

---

How do you evaluate your embedding model?

---

https://www.pinecone.io/learn/chunking-strategies/

---

https://research.trychroma.com/evaluating-chunking

---

https://platform.openai.com/docs/guides/prompt-engineering

---

What is the difference between generative AI and predictive AI? This is something I need to look further into.

---

Large language models get the hype, but compound systems are the future of AI.

https://www.youtube.com/watch?v=vRTcE19M-KE

---

ChatGPT is primarily a system, but it's always announced by OpenAI as a model.

---

Models by themselves are completely inert. All it really does by itself is represent things in an abstract space.

When you give a model a prompt, and you choose a sampling method, you now have a system. The prompt and the sampling method are nontrivial choices that turn a model into a system.

---

The performance of a system is at least partially not to do with the model itself. It's about the tools that the model has access to, the method with which it's prompted. And often those things have an outsized effect on the final accuracy or usefulness of the model.

---

Christopher Potts says that the current state of AI is that we are focusing too much on one part of the system. Focusing on the model at the expense of the system is like focusing on a Formula One car engine instead of the entire car.

---

Christopher Potts says small models in smart systems is always going to be better than big models in simplistic systems.

https://www.youtube.com/watch?v=vRTcE19M-KE

---

There are many different sampling methods when you're generating text using LLM:

- Greedy decoding, where we're just going to generate the probable next token based on what has come in so far.
- Top-p sampling
- Beam search
- Token diversity
- Valid JSON

---

The sampling method is equivalent to working the model like a puppet. You are forcing the model to speak - it doesn't do that intrinsically. Thinking about it this way makes it clear that there is no one true sampling method. The sampling method you pick will be highly consequential.

https://www.youtube.com/watch?v=vRTcE19M-KE

---

The origins of in-context learning are Radford et al. 2019, the GPT-2 paper.

We demonstrate language models can perform downstream tasks in a zero-shot setting without any parameter or architecture modification.

https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf

---

The GPT-3 paper is also a remarkable example of in-context learning. They went from GPT-2, which was less than 2 billion parameters, to GPT-3, which was around 175 billion.

It contained some of the first examples of few-shot prompting.

---

Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design, or: How I Learned to Start Worrying About Prompt Formatting

Shows several dramatic examples where a tiny choice in the prompt can lead to enormous differences in outcomes.

https://arxiv.org/abs/2310.11324

---

RAG-QA Arena: Evaluating Domain Robustness for Long-form Retrieval Augmented Question Answering

https://arxiv.org/abs/2407.13998

---

https://medium.com/@raphael.mansuy/quantalogic-create-production-ready-documentation-with-ai-powered-react-agents-fe12ae9aae97

---

The famous "let's think step by step" prompt is not necessarily even the best version of the chain of thought prompt. In echo prompt, instructing the model to rephrase queries for improved in-context learning, they showed there is a wide variation depending on how you frame the chain of thought prompt.

In other words, you can ask "let's repeat the question and also think step by step" or "let's reiterate the question and also think step by step," and this will have a wide variation in outcomes.

https://arxiv.org/abs/2309.10687

---

Prompts are really like compiled binaries. Even though they're written in natural language, they are meant to be paired with the system they operate in.

https://www.youtube.com/watch?v=vRTcE19M-KE

---

77% of enterprise AI usage are using models that are small models less than 13 billion parameters.

https://tomtunguz.com/small-but-mighty-ai/

---

Christopher Potts says that the various battle arenas like chatbot arena, helm, open LLM leader board are all focusing on slightly the wrong thing. They are all comparing the engines of cars instead of racing the cars. They should be evaluating the entire system instead of just one small part of it, the model.

https://www.youtube.com/watch?v=vRTcE19M-KE

---

Prompt engineering should probably not be a manual process. You should be using tools which generate prompts for you. You should be using data-driven optimizations. Instead of manually working out the perfect thing to say to the LLM, the prompt should be generated for you and tested in a bunch of different ways.

This way, we create a system that is robust to changing the model.

---

Let's say you're building an evaluator which is evaluating some marketing copy based on metrics. You want to grade the marketing copy for emotional appeal and clarity. One way to do this is to say to the LLM just rank this out of 1 to 10, so a 7 for emotional appeal and a 6 for clarity.

It turns out that LLMs are really bad at this. LLMs can't create effective grades for things because they don't really know what the numbers mean in those contexts. This comes up all the time in evaluations.

The best thing to do is to use a natural language-based scale. So:

- Extremely unclear
- Partially unclear
- Somewhat unclear
- Clear
- Very clear
- Extremely clear

Then you can map those descriptors into numbers.

---

Thoughtbench is an interesting project to compare different models side by side, including their chain of thought reasoning.

https://github.com/disler/benchy?tab=readme-ov-file
https://www.youtube.com/watch?v=UgSGtBZnwEo

---

I wonder which properties returned from each API allow you to view the chain of thought. I also wonder whether the AI SDK lets you view those. Maybe on experimental provider metadata?

---

Agentic RAG

https://arxiv.org/pdf/2501.09136

---

How do you allow users to use their own API keys in a secure way? For instance, putting in their OpenAI API key?

---

Need to think about error handling during streaming. How to fail gracefully.

---

Need to think about caching LLM responses, and making that caching feel natural.

---

When are LLMs overkill? When should you have a small and more focused neural network defined and trained with Tensorflow or PyTorch?

---

I think models versus systems is an extremely good way to think about it. It defines the role of the AI engineer really well. The AI engineer does not really focus on the model. The engineer focuses on the environment where the model operates.

This means that the AI engineer can squeeze a lot of juice out of a small model by placing it in a part of a smart system.

Which would you consider more powerful: a smart model in a simple system or a simple model in a smart system?

---

Need to not only look at chain of thought, but also self-consistency, active prompting, and multimodal chain of thought. Each has strengths and weaknesses depending on the specific application.

---

Chip Huyen's book draws a distinction between reflection and planning. Other resources in this space don't seem to do that very much.

---

Active Prompting with Chain of Thought

https://arxiv.org/pdf/2302.12246

---

Tree of Thoughts papers:

https://arxiv.org/abs/2305.10601

https://arxiv.org/abs/2305.08291

---

A paper on how in-context learning works from 2022:

https://ai.stanford.edu/blog/understanding-incontext/

---

Multi-agent survey paper

https://arxiv.org/pdf/2402.01680

---

CrewAI

https://docs.crewai.com/introduction

---

Atomic Agents

https://github.com/BrainBlend-AI/atomic-agents

---

pyspur

https://github.com/PySpur-Dev/pyspur

---

autogen

https://github.com/microsoft/autogen

---

LangGraph

https://langchain-ai.github.io/langgraph/tutorials/introduction/

---

Mastra AI

https://mastra.ai/

---

CrewAI has four key concepts:

1. Crew: The top-level organization that manages AI agent teams, oversees workflows, ensures collaboration, and delivers outcomes.

2. AI Agents: Specialized team members with specific roles (like researcher and writer). These agents are designated tools that can also delegate tasks.

3. Process: The workflow management system that controls task assignment to specific agents.

4. Tasks: Individual assignments with clear objectives, specific tools, and actionable results.

---

Seems like in CrewAI, you define your tasks and agents in YAML.

---

CrewAI's quick start has you build a crew that researches and reports on the latest AI developments.

---

Each agent in CrewAI is given a role, a goal, and a backstory.

Backstory in particular is such a wonderful property name. For instance, you might be a researcher or a reporting analyst—both of those are roles. Each of those might have goals such as:

- Uncover cutting-edge developments in a certain topic
- Create detailed reports on a topic or data analysis

And then the backstory is: "You're a meticulous analyst with a keen eye for details."

Several types of prompting are happening here.

---

In the tasks YAML file, you define different tasks assigned to each agent. For instance, a research agent can have a research task. Each task has a description and an expected output.

---

https://serper.dev/

---

A really nice idea would be an AI SDK tools repo. This would simply create a bunch of tool sets that could be used with AI agents. Parameters would be defined in Zod descriptions, etc., and they would be evaluated with Evalite.

---

Crew AI bundles in a CLI that reads all of the files and then runs the output.

For instance, in the quick starts, it creates a report markdown file based on the input that you created.

---

CrewAI bundles in an enterprise solution which lets you deploy your crew to a production environment.

---

You can start to see why these frameworks are so attractive: you not only get a strong set of concepts for building with AI, but also a production-ready solution that bundles in logs and deployment. The tricky part is how to assess how good one of these frameworks is from the off, because you not only have to assess the quality of the code but also the quality of the cloud provider.

---

CrewAI assumed so strongly that you will use its prebuilt toolsets that it buries the create custom tools documentation deep in the docs.

---

You can also define tool caching in CrewAI, which is really fascinating.

---

CrewAI allows for code execution simply by passing `allow_code_execution` to the agent as a configuration.

---

Web search - it is extremely complex.

---

https://www.firecrawl.dev/

---

https://exa.ai/

---

shadcn registry

---

https://github.com/transitive-bullshit

Open Tools

---

Data-driven approach for prompt creation.

Black-box approach for prompt creation.

https://github.com/stanfordnlp/dspy

---

If there's additional comments on the downvote, raise them.

---

How do you handle feedback as it scales?

Karpathy spent most of his time at OpenAI working on evals.

---

With DSPy, you're still prompt engineering.

---

Prompt optimizers

https://blog.langchain.dev/exploring-prompt-optimization/

---

Prompt optimizers work off some internal dataset, with a lot of work being put into them.

---

Multi-modal behavior is impossible to secure. Text is inherently easier to police.

---

Groq 3 coming out in two weeks

---

Aider is an awesome example of Reflexion

https://github.com/Aider-AI/aider

---

Anthropic Citations

https://www.anthropic.com/news/introducing-citations-api

---

https://github.com/maitrix-org/llm-reasoners

---

Investigate Anthropic Claude prompt

---

Precision and Accuracy Definitions:

Precision: The degree of refinement with which an operation is performed or a measurement is stated. In statistics and measurement, precision refers to the closeness of multiple measurements to each other (repeatability).

Accuracy: The closeness of a measured value to a true or accepted value. It indicates how close a measurement is to the actual target or standard.

Key Differences:

- Precision is about consistency and reproducibility of measurements
- Accuracy is about how close the measurement is to the true value

Example:

- A dart board analogy can help:
  - High precision, low accuracy: Darts clustered tightly but far from the bullseye
  - High accuracy, low precision: Darts spread out but centered around the bullseye
  - High accuracy and precision: Darts clustered tightly near the bullseye

---

So with DsPY versus normal prompting or manual prompting, there is a lot to consider. First of all, you need a tonne of data going through the DsPY system in order to make it optimized enough. Then you may want to consider that in a multi-agent setup or a pipeline, you're going to have multiple prompts. So focusing on a single prompt and trying to optimize that—well, how do you get the data for only that prompt?

---

Collapsing Multi-Step Calls into a Single Prompt. There's a really good exercise here where we create an entire chain with potentially smaller models which adds a lot of latency. But what about if we just instead use different XML tags in Claude, let's say, to put this all into one output? You essentially run the entire sequential chain through a single prompt.

---

There's a really great UI idea here where you get the application to create some plans, allow the user to edit those plans, and then take actions based on that. You could even allow it to generate concise thoughts which it feeds to the user. The user can then edit those thoughts, feed them back into the process. You can get some extremely good data off this because you not only have the initial prompt, but also how the user goes and edits that. The user could potentially cancel that as well. The "Human in the loop" stuff is absolutely fascinating.

---

I should introduce the `<thinking>` tag when talking about Anthropic's models, especially since Anthropic's models are optimized for handling XML tags. The `<thinking>` tag allows you to pass reasoning tokens to the user, just like o1 and R1 do, allowing the user to potentially edit those reasoning tags. Also sounds pretty cool.

---

Another question is how do you handle feedback as it scales? You probably want to handle different down votes differently. You may want to score a down vote higher if it belongs to a power user as opposed to a new user. You may even want to preferentially handle certain pieces of feedback if they're from your enterprise customers. You may want to add an extra weight to the down vote if there's additional comments associated with it. Building these systems is extremely important.

---

There's no declarative system for creating prompts right now. We're all just "jQuery-ing" our prompts—we are creating imperative prompts which are resistant to change. Eventually, someone will create the React for prompts and a declarative framework for building prompts. This could be dspy.

---

Every AI product sucks to start with because you haven't put enough data through the system in order to make it better. The fact that these products suck can actually impact whether managers and companies decide to put it out there. Figma AI is a great example.

---

One fascinating project we could build is essentially building Perplexity. You need to use Serpa in order to grab the web results, but then you also need to go into each page. Going to each page can be parallelized, but then you probably also need to chunk the related information.

Feed that into a RAG system and then retrieve only the relevant chunks related to the user query. You could then also have a query rewriter that rewrites the query to be more specific to the user's actual needs and gives you more information.

How do you perform the RAG? How do you perform the embeddings? Do you use contextual embeddings like Anthropic suggest? How large are your chunks? What should the UI be while all this is happening?

---

The first steps for making Perplexity would be to hook up the correct APIs:

1. You would need SERP API in order to fetch search results.

2. You would need a web scraping API like FireCrawl.

3. You would then need an embeddings API.

You should cache the result of these tool calls because we are for sure going to be slamming them with evals.

You can introduce a query rewriter.

---

In the Agentic RAG paper, it says traditional RAG systems are constrained by static workflows and lack the adaptability required for multistep reasoning and complex task management.

---

Agentic RAG transcends these limitations by embedding autonomous AI systems into the RAG pipeline.

---

Agentic RAG leverages agentic design patterns, reflection planning tools, and multi-agent collaboration. This can adapt to workflows to meet complex task requirements. This means Agentic RAG systems are extremely flexible, scalable, and useful across diverse applications.

---

So non-Agentic RAG is essentially RAG without a feedback loop. With a feedback loop, an agent can reason about the information it's received.

---

I should do a paper breakdown on Agentic RAG.

Very useful as a survey of the current iteration of Agentic RAG programmes.

https://arxiv.org/pdf/2501.09136

---

Agent Survey, 15th December 2024

https://arxiv.org/pdf/2308.11432

---

The Agentic RAG paper delineates a difference between naive RAG, modular RAG, and graph RAG.

---

Investigate simple keyword-based retrieval techniques such as TF-IDF and BM25.

---

The downsides with naive RAG is that the chunks have a lack of contextual awareness because there isn't any advanced preprocessing of the chunks. It often leads to disjointed or overly generic responses.

Keyword-based retrieval techniques also struggle with large data sets, often failing to identify the most relevant information.

Despite these limitations, naive RAG systems provide a proof of concept for integrating retrieval with generation. This lays the foundation for more sophisticated paradigms.

https://arxiv.org/pdf/2501.09136

---

The Agentic RAG (Retrieval-Augmented Generation) paper characterizes advanced RAG as using reranker LLMs to retrieve documents, prioritizing the most contextually relevant information.

https://arxiv.org/pdf/2501.09136

---

The Agentic RAG paper describes a modular RAG system as one which is broken down into several modular parts.

It describes several patterns such as:

- Retrieve then read
- Rewrite, retrieve, re-rank, read
- Retrieve, read, retrieve, read in a loop

There is also one called "demonstrate, search, predict" which I'm not sure what it is.

https://arxiv.org/pdf/2501.09136

---

Graph RAG is really useful for capturing relationships between entities. It can handle structured and unstructured data through graph-based hierarchies, and it can enrich the context by pulling in information along these graph-based pathways.

https://arxiv.org/pdf/2501.09136

---

Graph RAG is less effective when your data is unstructured or poorly annotated.

https://arxiv.org/pdf/2501.09136

---

GraphRAG is really useful for domains where reasoning over structured relationships is crucial, such as healthcare diagnostics and legal research.

https://arxiv.org/pdf/2501.09136

---

Agentic RAG incorporates iterative refinement. It builds in feedback loops to improve the retrieval accuracy and response relevance. It also orchestrates tasks, meaning it's quite efficient for real-time applications.

https://arxiv.org/pdf/2501.09136

---

https://github.com/dqbd/tiktoken

---

Many AI companies now employ data labelers, dataset creators, and data quality engineers either integrated into or working alongside their core engineering teams.

---

When you're thinking about data curation, you need to address questions like:
- What data do you need?
- How much of it do you need?
- What does high quality or low quality data mean for you?

And then you need to think about techniques for data synthesis and processing. Curation, generation, and processing don't follow a linear path.

---

Data will mostly be blood, sweat, and tears. Working with data is really hard.

---

The right data can make a model more capable and safer. Poor data can cause the model to increase its biases and hallucinations. Mistakes in data can harm the model and waste resources.

---

Curating data is not just about creating new data; it's all about removing existing data to help a model unlearn bad behaviors.

---

At a high level, data creation follows three criteria: data quality, data coverage, and data quantity.

---

Data quality is like the quality of the ingredients in a meal: you can't have good food if your ingredients are spoiled. Data coverage is equivalent to having the right mix of ingredients, i.e., shouldn't have too much or too little sugar, and data quantity is about how many of these ingredients you should have.

---

A small amount of high-quality data can outperform a large amount of noisy data. 10,000 carefully crafted instructions are superior to hundreds of thousands of noisy instructions.

https://arxiv.org/abs/2403.04652

---

You can think of data as being high quality if it has any of the following six characteristics:

1. Relevance: The training example should be relevant to the task you're training the model to do. If the task is to answer legal questions, then a legal data set from the 19th century might not be relevant.

2. Alignment: The data has to be aligned with the requirements of the task. For example, if the task requires factual consistency, the annotation should be factually correct.

3. Consistency: The data should be consistent with itself. For instance, if you ask two annotators to annotate the same example, their annotation shouldn't be too different. In a corpus of essays, a good essay should look like other good essays. Inconsistent annotations can confuse the model, making it harder for the model to learn.

4. Formatting: Data should be correctly formatted. Nothing extraneous should be in the data, like HTML tags.

5. Uniqueness: The data should be sufficiently unique. Too many duplications can introduce biases and cause data contamination.

6. Compliance: The data should be legal to use. You shouldn't use any PII (Personally Identifiable Information) data if you're not allowed to.

---

Data coverage means the model's data should cover the range of problems you expect it to solve. Real-world users will have a wide range of problems, and the way they express those problems can be very different.

In the Llama 3 paper, meta researchers basically said that all of their gains were due to improving data quality and data coverage, not necessarily gains in their model architecture.

---

There's a common belief that high-quality code in math data is more effective than natural language text in boosting the model's reasoning capabilities.

---

In the vast majority of cases, you should see improvements after fine-tuning with 50 to 100 high-quality examples.

---

The data you create needs to be thoroughly inspected and validated. Your data is the knowledge base of your application.