---
id: lesson-887ql
---

Problem statement:

Our current implementation is not date-aware. This will lead to issues where users will ask for up to date information and the lm won't know what "up to date" means.

The solution is pretty simple. We need to tell the LLM what the current date and time is whenever we call it.

Steps to complete:

- Find the place where the LLM is being called via `streamText`

- Add the current date to the `system` prompt, with an encouragement to use the date in their queries when the user asks for up to date information

- Encourage the user to try out the system with information that is up to date, like the weather or the latest sports scores
