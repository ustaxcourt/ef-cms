import { ALLOWLIST_FEATURE_FLAGS } from '../../../shared/src/business/entities/EntityConstants';
import { externalUserCreatesElectronicCase } from '../fileAPetition/petitioner-creates-electronic-case';
import { loginAsPetitioner } from '../authentication/login-as-helpers';
import { scheduleTrialSession } from './schedule-trial-session';

export const REPORTING_DUE_DATE = '02/10/2099';
export const REPORTING_DUE_DATE_SHORT = '02/10/99';
export const REPORTING_JUDGE = 'Buch';

export type CalendaredReportingTrialSession = {
  docketNumber: string;
  trialSessionId: string;
};

/**
 * Turns the Reporting calendars feature flag on for the test, for both the API
 * and the client, and returns the flag's previous value so it can be restored.
 */
export function enableReportingCalendars(): Cypress.Chainable<
  boolean | number | string | null
> {
  const flag = ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key;

  cy.intercept('GET', '**/system/feature-flag/', req => {
    req.continue(res => {
      res.body[flag] = true;
    });
  });

  return cy
    .task<boolean | number | string | null>('toggleFeatureFlag', {
      flag,
      readOnly: true,
    })
    .then(previousValue => {
      cy.task('toggleFeatureFlag', { flag, flagValue: true });
      return cy.wrap(previousValue);
    });
}

export function restoreReportingCalendars(
  previousValue: boolean | number | string | null,
): void {
  cy.task('toggleFeatureFlag', {
    flag: ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key,
    flagValue: previousValue,
  });
}

/**
 * Creates a Reporting trial session with a judge assigned. The logged in user
 * must be able to create trial sessions.
 */
export function createReportingTrialSession({
  dueDate = REPORTING_DUE_DATE,
  judge = REPORTING_JUDGE,
  trialLocation = 'Mobile, Alabama',
}: Partial<{
  dueDate: string;
  judge: string;
  trialLocation: string;
}> = {}): Cypress.Chainable<string> {
  cy.get('[data-testid="trial-session-link"]').click();
  cy.get('[data-testid="add-trial-session-button"]').click();
  cy.get('[data-testid="Reporting-proceeding-label"]').click();
  cy.get('#due-date-picker').type(dueDate);
  cy.get('[data-testid="session-type-Regular"]').click();
  cy.get('[data-testid="trial-session-number-of-cases-allowed"]').type('10');
  cy.get('[data-testid="trial-session-trial-location"]').select(trialLocation);
  cy.get('[data-testid="trial-session-judge"]').select(judge);
  cy.intercept('POST', '**/trial-sessions').as('createReportingTrialSession');
  cy.get('[data-testid="submit-trial-session"]').click();

  return cy.wait('@createReportingTrialSession').then(({ response }) => {
    expect(response?.statusCode).to.eq(200);
    const trialSessionId: string = response?.body.trialSessionId;
    cy.get('[data-testid="success-alert"]').should('be.visible');
    return cy.wrap(trialSessionId);
  });
}

/**
 * Marks a case on an uncalendared trial session as QC complete. The session
 * detail page for the trial session must be displayed.
 */
export function markCaseQcCompleteForTrial(docketNumber: string): void {
  cy.intercept('PUT', `**/case-meta/${docketNumber}/qc-complete`).as(
    'updateQcComplete',
  );
  cy.get(`label[for="qc-complete-${docketNumber}"]`).click();
  cy.wait('@updateQcComplete').its('response.statusCode').should('eq', 200);
  cy.get(`#qc-complete-${docketNumber}`).should('be.checked');
}

/**
 * Sets the calendar for the trial session whose detail page is displayed and
 * waits for the cases to be calendared and their notices to be generated.
 */
export function setCalendarAndWaitForNotices(): void {
  cy.get('[data-testid="set-calendar-button"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('[data-testid="success-alert"]', { timeout: 120000 }).should(
    'contain.text',
    'Eligible cases set for trial.',
  );
}

/**
 * Creates a new electronically filed case, a Reporting trial session with that
 * case manually added and marked QC complete, and then sets the Reporting
 * calendar. Finishes logged in as the user provided by loginAsCalendarSetter.
 */
export function createCalendaredReportingTrialSession(
  loginAsCalendarSetter: () => void,
): Cypress.Chainable<CalendaredReportingTrialSession> {
  loginAsPetitioner();

  return externalUserCreatesElectronicCase().then(docketNumber => {
    loginAsCalendarSetter();

    return createReportingTrialSession().then(trialSessionId => {
      scheduleTrialSession(docketNumber, trialSessionId);
      cy.get('[data-testid="success-alert"]').should('be.visible');

      loginAsCalendarSetter();
      cy.visit(`/trial-session-detail/${trialSessionId}`);
      markCaseQcCompleteForTrial(docketNumber);
      setCalendarAndWaitForNotices();

      return cy.wrap({ docketNumber, trialSessionId });
    });
  });
}
