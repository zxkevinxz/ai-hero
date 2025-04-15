## The Problem

We are already seeing that our application is tricky to monitor. There are long conversational threads, Tool calls, And database queries we need to keep track of.

This will get even worse when we head to production. Our application will be put in front of users and anything that goes wrong could either cost us a lot of money (via calling the LLM) or annoy our users.

We need to add some kind of observability platform - one that we can use locally to assist our development and also monitor our production application.

There are many many options in this space. A whole cottage industry has sprung up around observability platforms targeted to LLMs.

I've decided to go for Langfuse. It's a platform that allows you to monitor and trace LLM applications. Here's why:

- It's **open source**, and can be **run locally via Docker**, so it's safer from vendor lock-in concerns
- It has a **generous free tier**, so it's easy to get started
- It **integrates well with Vercel's AI SDK**, so it's simple to set up

However, I wouldn't blame you for going for any of the other solutions in this space. They all have their pros and cons and are each fighting it out for dominance.

We are not sponsored by Langfuse - I just thought the product was pretty good and decided to recommend it as part of the course
