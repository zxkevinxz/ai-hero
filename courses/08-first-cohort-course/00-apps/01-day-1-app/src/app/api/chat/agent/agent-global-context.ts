import type { BadAttempt, PrevAnswer, SearchResult } from "./types";

export class AgentGlobalContext {
  public step = 0;
  private knowledgeGaps: string[];
  public diary: string[] = [];
  private initialQuestion: string;
  public currentQuestion: string;
  public searchResultsStore: Record<string, SearchResult> = {};
  private visitedUrls: string[] = [];
  public searchTerms: string[] = [];
  public prevAnswers: PrevAnswer[] = [];
  // public badAttempts: BadAttempt[] = [];

  constructor(opts: { question: string }) {
    this.knowledgeGaps = [opts.question];
    this.initialQuestion = opts.question;
    this.currentQuestion = opts.question;
  }

  isAnsweringInitialQuestion() {
    return this.currentQuestion === this.initialQuestion;
  }

  incrementStepCount() {
    this.step++;
  }

  updateCurrentQuestion() {
    if (this.knowledgeGaps.length > 0) {
      // We then focus on the _first_ element of the
      // knowledgeGaps array
      this.currentQuestion = this.knowledgeGaps.shift()!!!!;
    } else {
      this.currentQuestion = this.initialQuestion;
    }
  }
}
