const TOKEN_BUDGET_DANGER_ZONE_PERCENTAGE = 0.1;

export class TokenBudgetTracker {
  private tokensRemaining: number;
  private readonly tokenBudget: number;

  constructor(tokenBudget: number) {
    this.tokenBudget = tokenBudget;
    this.tokensRemaining = tokenBudget;
  }

  public logSpentTokens(tokens: number) {
    this.tokensRemaining -= tokens;
  }

  public getRemainingTokens() {
    return this.tokensRemaining;
  }

  /**
   * Returns true if the token budget is 90% drained
   */
  public isInDangerZone() {
    return (
      this.tokensRemaining <
      this.tokenBudget * TOKEN_BUDGET_DANGER_ZONE_PERCENTAGE
    );
  }
}
