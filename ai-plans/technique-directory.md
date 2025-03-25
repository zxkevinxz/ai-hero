# Plan for Completing Technique Directory Article

## Overview

This plan outlines the steps needed to complete the remaining sections of the technique directory article, starting from technique #6 (Reasoning) onwards. Each section should follow the established pattern of Problem/Solution, as shown in the existing sections.

## Style

Do not over-use lists. Prefer paragraphs - use lists only when necessary.

Refer to the reader as "you". Speak directly to the reader. Address them as if they are a competent developer and fellow AI engineer.

Each paragraph should contain no more than 40 words.

## Section Example

<problem>some problem description</problem>

<solution>some solution description</solution>

<paragraphs>2-3 paragraphs of text</paragraphs>

<resources>Resources in an unordered list</resources>

## Steps

### 6. Reasoning

**Problem**: The LLM is not doing well enough at complex, multi-step reasoning tasks, like coding or math problems.

**Solution**: Prompt the LLM to reason through the problem.

**Existing Resources**:

- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought) on chain-of-thought prompting
- [OpenAI's advice](https://platform.openai.com/docs/guides/prompt-engineering#tactic-instruct-the-model-to-work-out-its-own-solution-before-rushing-to-a-conclusion) on giving the model time to think before coming to a conclusion

Tasks:

- [ ] Read the resources
- [ ] Find a really good example from the resources
- [ ] Write a new section on chain-of-thought prompting
- [ ] Describe other types of reasoning prompts

### 7. Multishot Prompting

**Problem**: The LLM needs to understand a specific pattern or format but isn't getting it from a single example.

**Solution**: Provide multiple examples to help the LLM understand the pattern.

**Existing Resources**:

- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting) on multishot prompting

Use examples (multishot prompting) to guide Claude's behavior
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models here.

Examples are your secret weapon shortcut for getting Claude to generate exactly what you need. By providing a few well-crafted examples in your prompt, you can dramatically improve the accuracy, consistency, and quality of Claude’s outputs. This technique, known as few-shot or multishot prompting, is particularly effective for tasks that require structured outputs or adherence to specific formats.

Power up your prompts: Include 3-5 diverse, relevant examples to show Claude exactly what you want. More examples = better performance, especially for complex tasks.
​
Why use examples?
Accuracy: Examples reduce misinterpretation of instructions.
Consistency: Examples enforce uniform structure and style.
Performance: Well-chosen examples boost Claude’s ability to handle complex tasks.
​
Crafting effective examples
For maximum effectiveness, make sure that your examples are:

Relevant: Your examples mirror your actual use case.
Diverse: Your examples cover edge cases and potential challenges, and vary enough that Claude doesn’t inadvertently pick up on unintended patterns.
Clear: Your examples are wrapped in <example> tags (if multiple, nested within <examples> tags) for structure.
Ask Claude to evaluate your examples for relevance, diversity, or clarity. Or have Claude generate more examples based on your initial set.

Example: Analyzing customer feedback

- [OpenAI's docs](https://platform.openai.com/docs/guides/prompt-engineering#tactic-provide-examples) on providing examples

Providing general instructions that apply to all examples is generally more efficient than demonstrating all permutations of a task by example, but in some cases providing examples may be easier. For example, if you intend for the model to copy a particular style of responding to user queries which is difficult to describe explicitly. This is known as "few-shot" prompting.

SYSTEM
Answer in a consistent style.
USER
Teach me about patience.
ASSISTANT
The river that carves the deepest valley flows from a modest spring; the grandest symphony originates from a single note; the most intricate tapestry begins with a solitary thread.
USER
Teach me about the ocean.

Tasks:

- [ ] Expand beyond just resources
- [ ] Add examples of different types of multishot prompting
- [ ] Include best practices for example selection
- [ ] Show how to structure examples effectively

### 8. Temperature

**Problem**: The LLM's outputs are either too deterministic (boring) or too random (unreliable).

**Solution**: Adjust the temperature parameter to control the randomness of outputs.

**Existing Resources**:

- [OpenAI's API Reference](https://platform.openai.com/docs/api-reference/chat/create#chat-create-temperature)
- [Anthropic's Glossary Entry](https://docs.anthropic.com/en/docs/resources/glossary#temperature) for Temperature

### 9. Tool Calling

**Problem**: The LLM needs to interact with external systems or perform actions beyond text generation.

**Solution**: Give the LLM access to specific functions or tools it can call.

**Existing Resources**:

- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview) on tool calling
- [OpenAI's docs](https://platform.openai.com/docs/guides/prompt-engineering#tactic-give-the-model-access-to-specific-functions) on function calling

Tasks:

- [ ] Provide 3 options for the section

### 10. LLM Call Chaining

**Problem**: A single LLM call isn't sufficient to complete a complex task.

**Solution**: Break down the task into multiple LLM calls that build on each other.

**Existing Resources**:

- [Anthropic's docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-prompts) on prompt chaining
- [OpenAI's example](https://platform.openai.com/docs/guides/prompt-engineering#tactic-use-inner-monologue-or-a-sequence-of-queries-to-hide-the-model-s-reasoning-process) of using a series of prompts to create an "inner monologue"

Tasks:

- [ ] Expand beyond resources
- [ ] Add examples of different chaining patterns
- [ ] Include best practices for chain design
- [ ] Show how to handle errors in chains
- [ ] Add performance considerations

### 11. RAG

**Problem**: The LLM needs access to information that's not in its training data.

**Solution**: Retrieve relevant information and include it in the prompt.

**Existing Resources**:

- [OpenAI's article](https://help.openai.com/en/articles/8868588-retrieval-augmented-generation-rag-and-semantic-search-for-gpts) on RAG and semantic search
- [OpenAI's docs section](https://platform.openai.com/docs/guides/optimizing-llm-accuracy#retrieval-augmented-generation-rag) on RAG

Tasks:

- [ ] Expand beyond resources
- [ ] Add implementation examples
- [ ] Include different RAG architectures
- [ ] Show how to evaluate RAG performance
- [ ] Add common pitfalls and solutions

### 12. Chunking

**Problem**: The information you want to retrieve is too large to fit in the context window.

**Solution**: Break down the information into smaller, manageable chunks.

Tasks:

- [ ] Expand beyond bullet points
- [ ] Add different chunking strategies
- [ ] Include chunk size selection guidelines
- [ ] Show how to implement chunking
- [ ] Add evaluation metrics for chunking

### 13. Agentic Loops

**Problem**: The LLM needs to autonomously explore and solve complex problems.

**Solution**: Create a loop where the LLM can plan, execute, and evaluate its actions.

**Existing Resources**:

- [Anthropic's Article](https://www.anthropic.com/engineering/building-effective-agents) on building effective agents mentions the agentic loop

Tasks:

- [ ] Expand beyond resources
- [ ] Add examples of agentic loop implementations
- [ ] Include different loop patterns
- [ ] Show how to handle loop termination
- [ ] Add monitoring and debugging strategies

### 14. Parallelizing LLM Calls

**Problem**: Multiple LLM calls are taking too long to complete sequentially.

**Solution**: Run multiple LLM calls in parallel to improve performance.

**Existing Resources**:

- [Anthropic's Article](https://www.anthropic.com/engineering/building-effective-agents) on building effective agents mentions parallelizing LLM calls
- [OpenAI's docs](https://platform.openai.com/docs/guides/latency-optimization#parallelize) include a section on parallelizing LLM calls

Tasks:

- [ ] Expand beyond resources
- [ ] Add implementation examples
- [ ] Include different parallelization strategies
- [ ] Show how to handle rate limits
- [ ] Add performance optimization tips

### 15. Evaluator-Optimizer

**Problem**: The LLM's performance needs to be continuously improved.

**Solution**: Create a loop where an evaluator assesses performance and an optimizer makes improvements.

**Existing Resources**:

- [Anthropic's Article](https://www.anthropic.com/engineering/building-effective-agents) on building effective agents mentions the Evaluator-Optimizer pattern

Tasks:

- [ ] Expand beyond resources
- [ ] Add implementation examples
- [ ] Include different evaluation strategies
- [ ] Show how to structure the optimization loop
- [ ] Add metrics for measuring improvement

### 16. LLM Routers

**Problem**: Different types of queries need different handling strategies.

**Solution**: Use an LLM to route queries to the most appropriate handler.

**Existing Resources**:

- [Anthropic's Article](https://www.anthropic.com/engineering/building-effective-agents) on building effective agents mentions LLM routers
- [OpenAI's description of Intent Classification](https://platform.openai.com/docs/guides/prompt-engineering#tactic-use-intent-classification-to-identify-the-most-relevant-instructions-for-a-user-query) is an LLM router in all but name

Tasks:

- [ ] Expand beyond resources
- [ ] Add implementation examples
- [ ] Include different routing strategies
- [ ] Show how to handle edge cases
- [ ] Add performance considerations

### 17. Fine-Tuning

**Problem**: The base model isn't performing well enough on your specific use case.

**Solution**: Fine-tune the model on your specific data.

**Existing Resources**:

- OpenAI has a [section](https://platform.openai.com/docs/guides/optimizing-llm-accuracy#fine-tuning) in their docs on fine-tuning

Tasks:

- [ ] Expand beyond resources
- [ ] Add step-by-step fine-tuning guide
- [ ] Include data preparation best practices
- [ ] Show how to evaluate fine-tuned models
- [ ] Add cost considerations

### 18. The Next Big Thing

Braindump:

The field is moving astonishingly quickly. It's impossible to keep up with all the developments.

This list as it stands is nowhere near complete. We've hardly scratched the surfaceof prompt engineering techniques, Subtleties in using rag, and The potential ramifications for tool use and LLM chaining.

Whatever the next big thing is, Make sure you experiment with it using the same techniques that we've seen before - using your evals.

And make sure you assess the next big thingusing the same axes we've come to understandhow complex is it how much will it cost.And don't forget to try the simple thing first
