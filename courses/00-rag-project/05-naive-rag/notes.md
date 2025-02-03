- Introduce Vector databases
- TRY adding pgvector to Postgres
- Writing a basic chunking algorithm
- Inspecting the chunks
- Embedding the chunks
- Using cosineSimilarity to fetch the chunks
  based on the user query
- Top-K chunks
- TRY messing about with Top-K
- TRY tracing the chunks used in Evalite

---

The downsides with naive RAG is that the chunks have a lack of contextual awareness because there isn't any advanced preprocessing of the chunks. It often leads to disjointed or overly generic responses.

Keyword-based retrieval techniques also struggle with large data sets, often failing to identify the most relevant information.

Despite these limitations, naive RAG systems provide a proof of concept for integrating retrieval with generation. This lays the foundation for more sophisticated paradigms.

https://arxiv.org/pdf/2501.09136
