export function assertDocketEntryPageCount({
  eventCode,
  expected,
}: {
  eventCode: string;
  expected: string;
}) {
  cy.contains('[data-testid^="docket-entry-eventCode-"]', eventCode)
    .parents('tr')
    .find('.number-of-pages')
    .should('have.text', expected);
}

export function assertNoticeOfDocketChangeExists() {
  cy.contains('[data-testid^="docket-entry-eventCode-"]', 'NODC').should(
    'exist',
  );
}

export function assertNoticeOfDocketChangeDoesNotExist() {
  cy.get('[data-testid^="docket-entry-eventCode-"]')
    .filter((_, el) => /\bNODC\b/.test(el.textContent || ''))
    .should('have.length', 0);
}

// Polls the DB until a docket entry with the given event code exists on the
// case (or fails after `maxAttempts`). The QC complete flow writes its
// resulting NODC / coversheet entries asynchronously after the loading
// overlay clears, so a single cy.task call can race the writes.
export function waitForDocketEntryByEventCode({
  docketNumber,
  eventCode,
  maxAttempts = 30,
  intervalMs = 1000,
}: {
  docketNumber: string;
  eventCode: string;
  maxAttempts?: number;
  intervalMs?: number;
}): Cypress.Chainable<unknown> {
  const poll = (attempt: number): Cypress.Chainable<unknown> =>
    cy
      .task<{ docketEntryId: string }[]>(
        'getDocketEntryIdsByDocketNumberAndEventCode',
        { docketNumber, eventCode },
      )
      .then(rows => {
        if (rows.length > 0) return;
        if (attempt >= maxAttempts) {
          throw new Error(
            `No ${eventCode} docket entry appeared on ${docketNumber} after ${attempt} polls`,
          );
        }
        return cy.wait(intervalMs).then(() => poll(attempt + 1));
      });
  return poll(0);
}

// Returns the current count of docket entries for an event code on a case
// (no retry — single read).
export function readDocketEntryCount({
  docketNumber,
  eventCode,
}: {
  docketNumber: string;
  eventCode: string;
}): Cypress.Chainable<number> {
  return cy
    .task<{ docketEntryId: string }[]>(
      'getDocketEntryIdsByDocketNumberAndEventCode',
      { docketNumber, eventCode },
    )
    .then(rows => rows.length);
}
