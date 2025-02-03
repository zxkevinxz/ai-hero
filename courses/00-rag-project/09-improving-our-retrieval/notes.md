- Now our chunks are looking better, how do we improve
  the way we retrieve them?
- BM25 with Embeddings
- LLM re-ranker to re-rank the BM25 results with the embeddings results
- TRY query rewriting
- TRY eval-ing the query rewriter on its own
- TRY HyDe
- TRY experimenting with different embedding models

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
