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

// Negative-assertion poller: confirms the docket-entry count for an event
// code stays at `expected` across a window of consecutive reads. Used to
// guard against async writes (NODC, coversheet regen) that could fire after
// the QC complete response. Fails fast if a wrong write lands mid-window.
export function assertDocketEntryCountRemainsAt({
  docketNumber,
  eventCode,
  expected,
  checks = 6,
  intervalMs = 500,
}: {
  docketNumber: string;
  eventCode: string;
  expected: number;
  checks?: number;
  intervalMs?: number;
}): Cypress.Chainable<unknown> {
  const step = (remaining: number): Cypress.Chainable<unknown> =>
    readDocketEntryCount({ docketNumber, eventCode }).then(count => {
      if (count !== expected) {
        throw new Error(
          `Expected ${eventCode} count to remain ${expected} on ${docketNumber}, but observed ${count}`,
        );
      }
      if (remaining <= 1) return;
      return cy.wait(intervalMs).then(() => step(remaining - 1));
    });
  return step(checks);
}
