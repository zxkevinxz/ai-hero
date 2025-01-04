A simple setup for using the Vercel AI SDK to connect to [LM Studio](https://lmstudio.ai/).

## Instructions

1. Download LM Studio from [lmstudio.ai](https://lmstudio.ai/).

2. Download a model. The app should prompt you to download a model when you first open it.

3. Go to the developer panel and start the local server.

4. Test the server by visiting http://localhost:1234/v1/models. You should see a JSON output of the models you have downloaded.

5. Run `evalite watch local-llm` to start the local server.

## Code

Start with [./local-llm.ts](./local-llm.ts).

## Description
