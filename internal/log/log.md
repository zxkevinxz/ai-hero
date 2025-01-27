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

https://sdk.vercel.ai/docs/ai-sdk-core/agents

---

"multiagent reinforcement learning" by shobha sinha

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