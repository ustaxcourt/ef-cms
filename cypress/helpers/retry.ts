/**
 * Retry helpers used by integration specs that exercise eventually-consistent
 * back-end behavior (e.g., OpenSearch refreshes, async case updates,
 * background jobs). Prefer Cypress-native retryability (`cy.get(...).should(...)`,
 * route aliases via `cy.intercept`) at call sites where possible. These helpers
 * remain available for cases where the callback must itself re-issue the
 * request that produces the observable state.
 */

const DEFAULT_RETRY_INTERVAL_MS = 500;
const DEFAULT_MAX_ATTEMPTS = 20; // 20 * 500ms = 10s budget, matches prior 5 * 2s.

export function retry(
  cb: () => Cypress.Chainable<boolean>,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
  retryIntervalMs: number = DEFAULT_RETRY_INTERVAL_MS,
): void {
  if (maxAttempts <= 0) {
    throw new Error('cypress failed to successfully run a retry block');
  }
  cb().then((isDone: boolean) => {
    if (isDone) {
      cy.log('retry condition passed, found expected elements');
      return;
    }
    // Yield to Cypress's command queue with a short, retry-friendly pause
    // before re-invoking the callback. Using a Cypress.Promise keeps the
    // delay inside the command chain so that subsequent commands are
    // properly ordered.
    cy.then(
      () =>
        new Cypress.Promise<void>(resolve => {
          setTimeout(resolve, retryIntervalMs);
        }),
    );
    retry(cb, maxAttempts - 1, retryIntervalMs);
  });
}

export function assertExists(selector: string): Cypress.Chainable<boolean> {
  // The DOM check below does not have built-in Cypress retries, so this
  // helper is intended to be wrapped by `retry()`, which will re-invoke the
  // assertion until it succeeds or the attempt budget is exhausted.
  return cy.get('body').then(body => {
    return body.find(selector).length > 0;
  });
}

export function assertDoesNotExist(
  selector: string,
): Cypress.Chainable<boolean> {
  return cy.get('body').then(body => {
    return body.find(selector).length === 0;
  });
}
