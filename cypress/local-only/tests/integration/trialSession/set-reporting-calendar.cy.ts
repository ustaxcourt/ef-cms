import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import {
  CalendaredReportingTrialSession,
  REPORTING_DUE_DATE_SHORT,
  REPORTING_JUDGE,
  createCalendaredReportingTrialSession,
  createReportingTrialSession,
  enableReportingCalendars,
  restoreReportingCalendars,
} from '../../../../helpers/trialSession/create-calendared-reporting-trial-session';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsCaseServicesSupervisor,
  loginAsClerkOfCourt,
  loginAsDocketClerk,
  loginAsPetitioner,
  loginAsPetitionsClerk,
  loginAsTrialClerk,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Set Reporting Calendar', { scrollBehavior: 'center' }, () => {
  let previousFlag: boolean | number | string | null;

  beforeEach(() => {
    enableReportingCalendars().then(value => {
      previousFlag = value;
    });
  });

  afterEach(() => {
    restoreReportingCalendars(previousFlag);
  });

  const calendarSetters = [
    { login: loginAsPetitionsClerk, role: 'petitions clerk' },
    { login: loginAsCaseServicesSupervisor, role: 'case services supervisor' },
    { login: loginAsClerkOfCourt, role: 'clerk of the court' },
  ];

  calendarSetters.forEach(({ login, role }) => {
    it(`should let a ${role} set a Reporting calendar, calendaring the QC complete case with a NAJ, an SSO, and a "PTMs Due" deadline`, () => {
      createCalendaredReportingTrialSession(login).then(
        ({ docketNumber, trialSessionId }: CalendaredReportingTrialSession) => {
          // The calendared session keeps its Reporting layout and lists the case
          cy.location('pathname').should(
            'eq',
            `/trial-session-detail/${trialSessionId}`,
          );
          cy.contains('p.label', 'Due date').should('be.visible');
          cy.contains('h3', /^Reporting$/).should('be.visible');
          cy.contains('button', 'Print Session Information').should(
            'be.visible',
          );
          cy.get('[data-testid="set-calendar-button"]').should('not.exist');
          cy.contains('a', docketNumber).should('be.visible');

          // The session displays on the Calendared view without a 30 day notice reminder
          cy.get('[data-testid="trial-session-link"]').click();
          cy.get('[data-testid="calendared-trial-sessions-tab"]').click();
          cy.get('[data-testid="proceedingType-Reporting"]').click();
          cy.get(`[data-testid="trial-sessions-row-${trialSessionId}"]`)
            .should('contain.text', 'Reporting')
            .and('contain.text', REPORTING_DUE_DATE_SHORT)
            .find('[data-icon="clock"]')
            .should('not.exist');

          // The case is calendared and assigned to the session judge
          goToCase(docketNumber);
          cy.get('[data-testid="case-status"]').should(
            'contain.text',
            'Calendared',
          );

          // A Notice of Assignment of Judge and a Standing Scheduling Order are docketed and served
          cy.contains('[data-testid^="docket-entry-eventCode-"]', /^\s*NAJ\s*$/)
            .closest('tr')
            .as('NAJ_ROW');
          cy.get('@NAJ_ROW').should(
            'contain.text',
            `Notice of Assignment of Judge to Judge ${REPORTING_JUDGE}`,
          );
          cy.get('@NAJ_ROW')
            .find('[data-testid^="docket-entry-servedPartiesCode-"]')
            .should('contain.text', 'B');
          cy.get('@NAJ_ROW')
            .find('[data-testid="docket-record-cell-not-served"]')
            .should('not.contain.text', 'Not served');

          cy.contains('[data-testid^="docket-entry-eventCode-"]', /^\s*SSO\s*$/)
            .closest('tr')
            .as('SSO_ROW');
          cy.get('@SSO_ROW').should(
            'contain.text',
            'Standing Scheduling Order',
          );
          cy.get('@SSO_ROW')
            .find('[data-testid^="docket-entry-servedPartiesCode-"]')
            .should('contain.text', 'B');
          cy.get('@SSO_ROW')
            .find('[data-testid="docket-record-cell-not-served"]')
            .should('not.contain.text', 'Not served');

          // No Notice of Trial or Standing Pretrial Order is docketed
          cy.contains(
            '[data-testid^="docket-entry-eventCode-"]',
            /^\s*(NTD|SPTO|SPOS)\s*$/,
          ).should('not.exist');

          // A deadline for the Pretrial Memorandum is created on the due date
          cy.get('[data-testid="tab-tracked-items"]').click();
          cy.get('[data-testid="case-deadline-description"]')
            .should('have.length', 1)
            .and('contain.text', 'PTMs Due');
          cy.get('[data-testid="case-deadline-date"]').should(
            'contain.text',
            REPORTING_DUE_DATE_SHORT,
          );
        },
      );
    });
  });

  it('should not offer minute sheets to a trial clerk for a calendared Reporting session', () => {
    createCalendaredReportingTrialSession(loginAsPetitionsClerk).then(
      ({ docketNumber, trialSessionId }: CalendaredReportingTrialSession) => {
        loginAsTrialClerk();
        cy.visit(`/trial-session-detail/${trialSessionId}`);
        cy.contains('a', docketNumber).should('be.visible');

        cy.get('[data-testid="new-minute-sheet-button"]').should('not.exist');
        cy.get(`[data-testid="minute-sheet-button-${docketNumber}"]`).should(
          'not.exist',
        );

        // Navigating directly to the minute sheet sends the user back to the trial sessions list
        cy.visit(
          `/trial-session-detail/${trialSessionId}/case/${docketNumber}/minutes`,
        );
        cy.location('pathname').should('eq', '/trial-sessions');
        cy.get('[data-testid="trial-session-minutes-page"]').should(
          'not.exist',
        );
      },
    );
  });

  it('should not ask to generate, or docket, a notice when a case services supervisor edits the due date and judge of a calendared Reporting session', () => {
    createCalendaredReportingTrialSession(loginAsCaseServicesSupervisor).then(
      ({ docketNumber, trialSessionId }: CalendaredReportingTrialSession) => {
        cy.visit(`/trial-session-detail/${trialSessionId}`);
        cy.get('[data-testid="edit-trial-session"]').click();
        cy.get('#due-date-picker').clear();
        cy.get('#due-date-picker').type('03/15/2099');
        cy.get('[data-testid="trial-session-judge"]').select('Colvin');
        cy.intercept('PUT', '**/async/trial-sessions').as('editReporting');
        cy.get('[data-testid="submit-edit-trial-session"]').click();

        // The session is saved straight away, with no notice confirmation modal
        cy.wait('@editReporting');
        cy.get('[data-testid="modal-button-confirm"]').should('not.exist');
        cy.get('[data-testid="success-alert"]', { timeout: 60000 }).should(
          'contain.text',
          'Trial session updated',
        );
        cy.get('[data-testid="trial-session-date"]')
          .invoke('text')
          .should('contain', '03/15/99');

        // Only the two documents from setting the calendar are on the docket record
        goToCase(docketNumber);
        cy.contains(
          '[data-testid^="docket-entry-eventCode-"]',
          /^\s*NAJ\s*$/,
        ).should('exist');
        cy.contains(
          '[data-testid^="docket-entry-eventCode-"]',
          /^\s*SSO\s*$/,
        ).should('exist');
        cy.contains(
          '[data-testid^="docket-entry-eventCode-"]',
          /^\s*(NOT|NOTT|NTD)\s*$/,
        ).should('not.exist');
      },
    );
  });

  it('should let a docket clerk manually add a case to a calendared Reporting session, which is marked "(RP)" in the trial session list', () => {
    createCalendaredReportingTrialSession(loginAsPetitionsClerk).then(
      ({ trialSessionId }: CalendaredReportingTrialSession) => {
        loginAsPetitioner();
        externalUserCreatesElectronicCase().then(manuallyAddedDocketNumber => {
          loginAsDocketClerk();
          goToCase(manuallyAddedDocketNumber);
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="add-to-trial-session-btn"]').click();
          cy.get('[data-testid="all-locations-option"]').click();
          cy.get(
            `[data-testid="trial-session-select"] option[value="${trialSessionId}"]`,
          ).should('contain.text', '(RP)');
          cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
          cy.get('[data-testid="modal-button-confirm"]').click();

          cy.get('[data-testid="success-alert"]').should(
            'contain.text',
            'Case set for trial.',
          );
          cy.get('[data-testid="case-status"]').should(
            'contain.text',
            'Calendared',
          );

          cy.get('[data-testid="trial-session-location-link"]').click();
          cy.location('pathname').should(
            'eq',
            `/trial-session-detail/${trialSessionId}`,
          );
          cy.contains('a', manuallyAddedDocketNumber).should('be.visible');
        });
      },
    );
  });

  it('should tell the user that setting a Reporting calendar is not enabled when the feature flag is turned off after the session was created', () => {
    loginAsPetitionsClerk();
    createReportingTrialSession().then(trialSessionId => {
      cy.task('toggleFeatureFlag', {
        flag: ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key,
        flagValue: false,
      });
      cy.intercept('GET', '**/system/feature-flag/', {
        [ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key]: false,
      });
      loginAsPetitionsClerk();
      cy.visit(`/trial-session-detail/${trialSessionId}`);

      cy.get('[data-testid="set-calendar-button"]').click();

      cy.contains('Setting a Reporting calendar is not enabled.').should(
        'be.visible',
      );
      cy.get('[data-testid="modal-button-confirm"]').should('not.exist');
      cy.get('[data-testid="set-calendar-button"]').should('be.visible');
    });
  });

  it('should ask for a judge when setting the calendar of a Reporting session that does not have one', () => {
    loginAsPetitionsClerk();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get('[data-testid="add-trial-session-button"]').click();
    cy.get('[data-testid="Reporting-proceeding-label"]').click();
    cy.get('#due-date-picker').type('02/10/2099');
    cy.get('[data-testid="session-type-Regular"]').click();
    cy.get('[data-testid="trial-session-number-of-cases-allowed"]').type('10');
    cy.get('[data-testid="trial-session-trial-location"]').select(
      'Mobile, Alabama',
    );
    cy.intercept('POST', '**/trial-sessions').as('createReporting');
    cy.get('[data-testid="submit-trial-session"]').click();
    cy.wait('@createReporting').then(({ response }) => {
      cy.visit(`/trial-session-detail/${response?.body.trialSessionId}`);
    });

    cy.get('[data-testid="set-calendar-button"]').click();

    cy.contains('Provide a judge to set this trial session.').should(
      'be.visible',
    );
    cy.get('[data-testid="modal-button-confirm"]').should('not.exist');
  });
});
