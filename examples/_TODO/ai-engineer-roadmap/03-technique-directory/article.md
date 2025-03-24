---
slug: how-to-improve-your-llm-powered-app
---

Once you clearly understand your success criteria, have picked your model, and written some basic evals, it's time to start improving your system.

The process of improving your system comes down to two things:

- Improving your **feedback loop** (evals)
- Improving the **performance** of the system itself

We've already looked at how to improve your evals. In this article, I'll give you an overview of the main ways you can improve your system.

But first, let's talk about the mindset you need to have when improving your system.

## Try the Simple Thing First

We've already seen that improving an AI system is an [experimental process](/the-mindset-of-an-ai-engineer). You need to try things out, see what works, and iterate.

Techniques for improving a system range from simple and cheap to complex and expensive. Tweaking a prompt? Cheap. Training a model from scratch? Astonishingly expensive.

I call this the Staircase Of Complexity Hell:

_Image Placeholder_

The key is to start at the top of the staircase, and work your way down only when you've exhausted all the simpler options. Simple techniques can provide a huge improvement for a small amount of effort.

## Techniques To Try

This list is ordered from the simplest techniques to the most complex. Start at the top, and work your way down. I've linked to further resources where you can get more details on each technique.

### 1. Your First Prompt

**Problem**: You've got to start somewhere.

**Solution**: Here are some basic tips for improving your prompts:

- Be clear, direct, and specific.
- Think of the LLM as a brilliant, but very new, employee.
- Remember that the LLM has no context on your norms, styles, or guidelines.

#### Resources

- [Anthropic's Advice](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct) is a useful guide for understanding how to write good prompts.
- [Anthropic's Prompt Library](https://docs.anthropic.com/en/prompt-library/library) is a great way to explore good prompts for your use case.
- [OpenAI's docs](https://platform.openai.com/docs/guides/prompt-engineering#strategy-write-clear-instructions) on writing clear instructions.

### 2. Role-Based Prompting

**Problem**: You want the LLM to behave in a certain way no matter the input.

**Solution**: Use role-based prompting to get the LLM to adopt a persona.

This could be as diverse as adjusting the tone of voice:

```
You are a highly capable, thoughtful, and precise assistant.
```

Or even the accent:

```
You speak with a pirate's accent.
```

Or prime the LLM to talk about a certain topic:

```
You are an expert on the topic of TypeScript.
```

This is an extremely common technique, and very cheap to implement. It's usually done in a system prompt.

#### Resources

- My video on [System Prompts](https://www.aihero.dev/system-prompts-with-vercel-ai-sdk) in Vercel's AI SDK
- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts) on role-based prompting
- [OpenAI's docs](https://platform.openai.com/docs/guides/prompt-engineering#tactic-ask-the-model-to-adopt-a-persona) on asking the model to adopt a persona

### 3. XML Tags

#### XML Tags On The Input

**Problem**: You want to pass multiple pieces of information to the LLM in a single prompt.

**Solution**: Use XML tags.

XML tags can help provide delimiters for different parts of the prompt.

An example from Anthropic's docs is a financial report:

```
You’re a financial analyst at AcmeCorp. Generate a Q2 financial report for our investors.

Use this data for your report:

<data>
{{SPREADSHEET_DATA}}
</data>

<instructions>
1. Include sections: Revenue Growth, Profit Margins, Cash Flow.
2. Highlight strengths and areas for improvement.
</instructions>

Make your tone concise and professional. Follow this structure:

<formatting_example>
{{Q1_REPORT}}
</formatting_example>
```

#### XML Tags On The Output

**Problem**: You want the LLM to respond with multiple different outputs.

**Solution**: Tell the LLM to respond with different outputs based on the XML tags.

You can also tell your LLM to respond with different outputs based on the XML tags in the prompt. This can give you more control over the structure of the response.

You may want the LLM to review an article for you. You may want it to provide a `<summary>`, a `<critique>`, and `<suggested-improvements>`.

```
Review the article below and provide a summary, critique, and suggested improvements.

Wrap the summary in <summary> tags.
Wrap the critique in <critique> tags.
Wrap the suggested improvements in <suggested-improvements> tags.

<article>
{{ARTICLE}}
</article>
```

This technique was popularised by Anthropic, but most models also support it.

#### Resources

- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags) on using XML tags in your prompts
- [OpenAI's docs](https://platform.openai.com/docs/guides/prompt-engineering#tactic-use-delimiters-to-clearly-indicate-distinct-parts-of-the-input) mention using XML tags as delimiters

### 4. Prefilling The LLM's Response

**Problem**: You want to tightly constrain the text that comes back from the LLM - such as asking it to reply with a single word.

**Solution**: Prefill the LLM's response.

Conversations with LLM's use a data structure called a message history (I explored this in my [Vercel AI SDK course](https://www.aihero.dev/vercel-ai-sdk-messages-array?list=vercel-ai-sdk-tutorial)). This message history may look like this:

```json
[
  {
    "role": "user",
    "content": "What is the capital of France?"
  },
  {
    "role": "assistant",
    "content": "The capital of France is Paris."
  }
]
```

The example above is interesting. If we asked a LLM the capital of France, it could give us any number of diverse responses:

- "The capital of France is Paris."
- "Paris is the capital of France."
- "France's capital is Paris."
- "Thanks for the question! It's Paris."

But what if we wanted to only return a one-word answer, like "Paris"? When we send the message history to the LLM, we could prefill the `assistant` response like so:

```json
[
  {
    "role": "user",
    "content": "What is the capital of France?"
  },
  {
    "role": "assistant",
    "content": "The answer is "
  }
]
```

The LLM would then carry on the `assistant` response from there:

```json
[
  {
    "role": "user",
    "content": "What is the capital of France?"
  },
  {
    "role": "assistant",
    "content": "The answer is Paris."
  }
]
```

And we could get our one-word answer by stripping out the part we already know about: "The answer is".

There are lots of tricks here. If you want to return JSON, you can prefill the response with `{` and the LLM will complete the JSON object for you, without any preamble ("Here's the extracted data:").

#### Resources

- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prefill-claudes-response) on prefilling the LLM's response

### 5. Structured Outputs

**Problem**: You want the LLM to return structured data instead of text.

**Solution**: Use structured outputs.

Structured outputs are a way to get the LLM to return data in a structured format, like JSON. Most LLM providers support providing a JSON schema description of the output you want.

The [Vercel AI SDK](https://www.aihero.dev/structured-outputs-with-vercel-ai-sdk?list=vercel-ai-sdk-tutorial) is a particularly good toolset for this.

#### Resources

- [Anthropic's Docs](https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency) on JSON mode

### 6. Reasoning

#### Resources

- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought) on chain-of-thought prompting
- [OpenAI's advice](https://platform.openai.com/docs/guides/prompt-engineering#tactic-instruct-the-model-to-work-out-its-own-solution-before-rushing-to-a-conclusion) on giving the model time to think before coming to a conclusion

### 7. Multishot Prompting (Using Examples)

#### Resources

- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting) on multishot prompting
- [OpenAI's docs](https://platform.openai.com/docs/guides/prompt-engineering#tactic-provide-examples) on providing examples

### 8. Temperature

_TODO_

#### Resources

_TODO_

### 9. Tool Calling

#### Resources

- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview) on tool calling
- [OpenAI's docs](https://platform.openai.com/docs/guides/prompt-engineering#tactic-give-the-model-access-to-specific-functions) on function calling

### 10. LLM Call Chaining

#### Resources

- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-prompts) on prompt chaining
- [OpenAI's example](https://platform.openai.com/docs/guides/prompt-engineering#tactic-use-inner-monologue-or-a-sequence-of-queries-to-hide-the-model-s-reasoning-process) of using a series of prompts to create an "inner monologue"

### 11. RAG

- Retrieval can either be done via a tool call or it can be done in between LLM calls.

#### Resources

- [OpenAI's article](https://help.openai.com/en/articles/8868588-retrieval-augmented-generation-rag-and-semantic-search-for-gpts) on RAG and semantic search. There is also a [section](https://platform.openai.com/docs/guides/optimizing-llm-accuracy#retrieval-augmented-generation-rag) in their official docs.

### 12. Chunking

- If the data you're retrieving is too large to fit in the context window, you will likely want to chunk it down.
- You'll then take these chunks, pick the relevant ones, and insert those into the prompt.
- You may even want an LLM re-ranker to pick the relevant chunks.
- Not all RAG systems use chunking.

### 13. Agentic Loops

#### Resources

- [Anthropic's Article](https://www.anthropic.com/engineering/building-effective-agents) on building effective agents mentions the agentic loop.

### 14. Parallelizing LLM Calls

#### Resources

- [Anthropic's Article](https://www.anthropic.com/engineering/building-effective-agents) on building effective agents mentions parallelizing LLM calls.
- [OpenAI's docs](https://platform.openai.com/docs/guides/latency-optimization#parallelize) include a section on parallelizing LLM calls.

### 15. Evaluator-Optimizer

#### Resources

- [Anthropic's Article](https://www.anthropic.com/engineering/building-effective-agents) on building effective agents mentions the Evaluator-Optimizer pattern.

### 16. LLM Routers

#### Resources

- [Anthropic's Article](https://www.anthropic.com/engineering/building-effective-agents) on building effective agents mentions LLM routers.
- [OpenAI's description of Intent Classification](https://platform.openai.com/docs/guides/prompt-engineering#tactic-use-intent-classification-to-identify-the-most-relevant-instructions-for-a-user-query) is an LLM router in all but name.

### 17. Fine-Tuning

#### Resources

- OpenAI has a [section](https://platform.openai.com/docs/guides/optimizing-llm-accuracy#fine-tuning) in their docs on fine-tuning.

### 18. Distillation

_TODO_

### 19. The Next Big Thing

_TODO_
