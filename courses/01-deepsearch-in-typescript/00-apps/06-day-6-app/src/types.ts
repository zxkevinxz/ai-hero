import type { NextAction } from "./get-next-action";
import type { QueryRewriterResult } from "./query-rewriter";

type PlanAndQueriesAnnotation = {
  type: "PLAN_AND_QUERIES";
  plan: string;
  queries: string[];
};

type DecisionAnnotation = {
  type: "DECISION";
  decision: NextAction;
  feedback?: string;
};

export type OurMessageAnnotation =
  | PlanAndQueriesAnnotation
  | DecisionAnnotation;
