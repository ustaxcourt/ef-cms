import { calculateDate, createISODateString, getJsDateFromIso } from "@shared/business/utilities/DateHandler";

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
// case (or fails after `timeout` ms). The QC complete flow writes its
// resulting NODC / coversheet entries asynchronously after the loading
// overlay clears, so a single cy.task call can race the writes. Each cy.task
// IPC roundtrip provides natural throttling between polls, so no fixed-time
// cy.wait is needed between attempts.
export function waitForDocketEntryByEventCode({
  docketNumber,
  eventCode,
  timeout = 30000,
}: {
  docketNumber: string;
  eventCode: string;
  timeout?: number;
}): Cypress.Chainable<unknown> {
  const deadline = calculateDate({howMuch: timeout, units: 'milliseconds'});
  const poll = (): Cypress.Chainable<unknown> =>
    cy
      .task<{ docketEntryId: string }[]>(
        'getDocketEntryIdsByDocketNumberAndEventCode',
        { docketNumber, eventCode },
        { log: false },
      )
      .then<unknown>(rows => {
        if (rows.length > 0) return undefined;
        if (getJsDateFromIso(createISODateString()) >= deadline) {
          throw new Error(
            `No ${eventCode} docket entry appeared on ${docketNumber} within ${timeout}ms`,
          );
        }
        return poll();
      });
  return poll();
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
