import dedent from "dedent";
import type { BadAttempt, PrevAnswer, SearchResult } from "./types";
import type { AgentGlobalContext } from "./agent-global-context";

const diary = (diary: string[]) => {
  return dedent`
    You have conducted the following actions:

    ${diary.join("\n")}
  `;
};

const intro = () => {
  return dedent`
    You are an advanced AI research agent.
    You are specialized in multistep reasoning.
    Using your training data and prior lessons learned,
    answer the user question with absolute certainty.

    Current date: ${new Date().toUTCString()}
  `;
};

const tag = (tag: string, content: string) => {
  return [`<${tag}>`, content, `</${tag}>`].join("\n");
};

const knowledgeBase = (prevAnswers: PrevAnswer[]) => {
  return dedent`
    You have successfully gathered some knowledge which
    might be useful for answering the original question.
    Here is the knowledge you have gathered so far:

    ${tag(
      "knowledge",
      prevAnswers
        .map((prevAnswer) => {
          const references = prevAnswer.references
            ? tag(
                "references",
                prevAnswer.references
                  .map((ref) => ` - ${ref.exactQuote}: ${ref.url}`)
                  .join("\n"),
              )
            : "";

          return [
            tag("question", prevAnswer.question),
            tag("answer", prevAnswer.answer),
            references,
          ].join("\n");
        })
        .join("\n"),
    )}
  `;
};

const badAttempts = (badAttempts: BadAttempt[]) => {
  if (badAttempts.length === 0) {
    return "";
  }

  return dedent`
    Also, you have tried the following actions but
    failed to find the answer to the question:

    ${tag(
      "bad-attempts",
      badAttempts
        .map((badAttempt) => {
          return [
            tag("question", badAttempt.question),
            tag("answer", badAttempt.answer),
            tag("evaluation", badAttempt.evaluation),
            tag("recap", badAttempt.recap),
            tag("blame", badAttempt.blame),
          ].join("\n");
        })
        .join("\n"),
    )}

    Based on the failed attempts, you have learned the
    following strategy:

    ${tag(
      "strategy",
      badAttempts.map((badAttempt) => badAttempt.improvement).join("\n"),
    )}
  `;
};

const badRequestsToAvoid = (searchedKeywords: string[]) => {
  return dedent`
    - Avoid those unsuccessful search requests and queries:
    ${tag("bad-requests", searchedKeywords.map((keyword) => ` - ${keyword}`).join("\n"))}
  `;
};

const searchAction = (searchedKeywords: string[]) => {
  return tag(
    "action-search",
    dedent`
      - Use web search to find relevant information
      - Build a search request based on the deep intention
        behind the original question and the expected
        answer format
      - Always prefer a single search request, only
        add another request if the original question
        covers multiple aspects or elements and one
        query is not enough; each request should focus
        on one specific aspect of the original question
        and expected answer.
      ${badRequestsToAvoid(searchedKeywords)}
    `,
  );
};

const visitActionUrls = (searchResults: SearchResult[]) => {
  if (searchResults.length > 0) {
    return dedent`
      - Review relevant URLs below for additional information
      ${tag(
        "url-list",
        searchResults
          .map(
            (searchResult) => dedent`
              <query>${searchResult.query}</query>
              <url>${searchResult.url}</url>
              <snippet>${searchResult.snippet}</snippet>
              <date>${searchResult.date}</date>
            `,
          )
          .join("\n"),
      )}
    `;
  }

  return "";
};

const visitAction = (searchResults: SearchResult[]) => {
  return tag(
    "action-visit",
    dedent`
      - Access and read full content from URLs
      - Must check URLs mentioned in <question>
      ${visitActionUrls(searchResults)}
    `,
  );
};

const actions = (opts: {
  searchTerms: string[];
  searchResults: SearchResult[];
}) => {
  return dedent`
    Based on the current context, you must choose one of
    the following actions:

    ${tag(
      "actions",
      [
        searchAction(opts.searchTerms),
        visitAction(opts.searchResults),
        dedent`
          <action-answer>
          - For greetings, casual conversation, or general
            knowledge questions, answer directly without references.
          - For all other questions, provide a verified answer
            with references. Each reference must include
            exactQuote and url.
          - If uncertain, use <action-reflect>
          </action-answer>
        `,
        dedent`
          <action-reflect>
          - Critically examine <question>, <context>, <knowledge>,
            <bad-attempts>, and <learned-strategy> to identify
            gaps and the problems. 
          - Identify gaps and ask key clarifying questions
            that are deeply related to the original question
            and lead to the answer.
          - Ensure each reflection:
          - Cuts to core emotional truths while staying
            anchored to original <question>
          - Transforms surface-level problems into
            deeper psychological insights
          - Makes the unconscious conscious
          </action-reflect>
        `,
      ].join("\n"),
    )}
  `;
};

export type ContextNeededForPrompt = Pick<
  AgentGlobalContext,
  | "diary"
  | "prevAnswers"
  // | "badAttempts"
  | "searchTerms"
  | "searchResultsStore"
  | "step"
>;

export const getNextStepPrompt = (ctx: ContextNeededForPrompt) => {
  return [
    // An intro describing the agent and the current date
    intro(),

    // A diary of the agent's actions so far
    diary(ctx.diary),

    // The knowledge base the agent has built up
    knowledgeBase(ctx.prevAnswers),

    // // The bad attempts the agent has made
    // badAttempts(ctx.badAttempts),

    // The available actions the agent can take
    actions({
      searchTerms: ctx.searchTerms,
      searchResults: Object.values(ctx.searchResultsStore),
    }),
  ].join("\n\n");
};
