## Create A POC

1. Intro: Make a simple POC with the model retrieving information from its own training data

1. Add a simple eval for testing if the basics are working

1. Add a simple eval to make sure sources are shown

1. Add a simple frontend for showing the results

1. Add Postgres and Drizzle for storing the conversation histories

## Try Simple Evals

1. Create a simple dataset to test the model

1. Add an exact match eval to answer simple questions

1. Add a lexical simiarity eval to answer simple questions

1. Add a semantic similarity eval to ensure that the meanings are aligned

1. Add a factuality eval

1. Download a local model with Ollama to see how simple we can make the model

## Add External Tools

1. Get The Search Results From Serper, hook up to a tool

Use an eval based on modern events to ensure that the tool is working

1. Get The Web Scraping Results From FireCrawl, feed it directly into the context window

1. Set up simple file-system caching for our third-party API's results so we don't kill our API's

1. Track the tool calls in the frontend and use them to show our sources

## Add Evals

1. Test our system against a proper dataset

## Add RAG

1. Intro: We will quickly run into context window issues, so RAG will have to be a way to go.

1. Set up pgvector as a place to store the embeddings

1. Write a simple chunking function

1. Try semantic chunking

1. Try LLM chunking

1. Try contextual embeddings (a la Anthropic)

## Add A Query Rewriter

1. Add a query rewriter to write and expand the user's query

## Add Reasoning & Planning

1. Create a planning system (in a separate chain) to answer complex questions.

1. Add a reasoning system (using ReAct) after the planning system to go through and execute the tools.
