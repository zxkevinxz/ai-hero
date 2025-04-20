## Problem

We have picked out the easiest possible thing we could evaluate for our first eval.

But to know whether we are actually meeting our success criteria, we need to go a bit deeper.

Our main criteria for success is factuality - whether the answer is verifiably accurate.

For that we could use a human fact checker. We could pay someone (or do it ourselves) to check the LLMs answers and see if they're correct or not.

But this would be astonishingly expensive and time consuming.

But there is something else we can try. We can try using an LLM to judge an answer's factuality.

We have to be careful here - we need to provide the "LLM judge" with all the information it needs to perform its job correctly. It needs:

- The question asked
- The answer given
- The actual truth

We can do this by giving the LLM a prompt that includes all of this information. We can also do this within Evalite. Evalite's documentation has this exact example, using the AI SDK.

To help us debug the result, we can also get the judge to give us a breakdown of its reasoning along with its answer.
