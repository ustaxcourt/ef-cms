import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { getLastDraftOrderElementFromDrafts } from '../../../support/statusReportOrder';
import {
  loginAsColvin,
  loginAsColvinChambers,
  loginAsDocketClerk,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { scheduleTrialSession } from 'cypress/helpers/trialSession/schedule-trial-session';
import { calendarTrialSession } from 'cypress/helpers/trialSession/calendar-trial-session';
import { createStatusReport } from 'cypress/helpers/caseDetail/docketRecord/courtIssuedFiling/create-status-report-order';

describe('should default status report order descriptions', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const setup = {
    scheduledCaseDocketNumber: '',
    trialSessionId: '',
    unscheduledCaseDocketNumber: '',
  };

  const createUnscheduledCaseWithStatusReport =
    (): Cypress.Chainable<string> => {
      return createAndServePaperPetition().then(({ docketNumber }) => {
        createStatusReport(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

        return cy.wrap(docketNumber);
      });
    };

  const createScheduledCaseWithStatusReport = (): Cypress.Chainable<string> => {
    return createTrialSession().then(({ trialSessionId }) => {
      setup.trialSessionId = trialSessionId;

      return createAndServePaperPetition().then(({ docketNumber }) => {
        createStatusReport(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        calendarTrialSession(trialSessionId);
        scheduleTrialSession(docketNumber, trialSessionId);

        return cy.wrap(docketNumber);
      });
    });
  };

  const openLatestDraftAsDocketClerk = (docketNumber: string): void => {
    loginAsDocketClerk();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-drafts').click();
    getLastDraftOrderElementFromDrafts().click();
    cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
  };

  before(() => {
    loginAsPetitionsClerk1();

    return createScheduledCaseWithStatusReport().then(scheduledDocketNumber => {
      setup.scheduledCaseDocketNumber = scheduledDocketNumber;

      return createUnscheduledCaseWithStatusReport().then(
        unscheduledDocketNumber => {
          setup.unscheduledCaseDocketNumber = unscheduledDocketNumber;
        },
      );
    });
  });

  it('should display default description when document type is an Order', () => {
    judgeOrChambersCreatesStatusReportOrder(
      today,
      setup.unscheduledCaseDocketNumber,
    );
    openLatestDraftAsDocketClerk(setup.unscheduledCaseDocketNumber);
    cy.get('[data-testid="court-issued-document-type-search"]').should(
      'have.text',
      'Order',
    );
    cy.get('[data-testid="document-description-input"]').should(
      'have.value',
      `Order parties by ${today} shall file a status report.`,
    );
    cy.get('[data-testid="docket-entry-preview-text"]').should(
      'have.text',
      `Docket entry preview: Order parties by ${today} shall file a status report.`,
    );
  });

  it('should set event code to OJR when case is stricken from trial session and jurisdiction is retained and display default description', () => {
    judgeOrChambersCreatesStatusReportOrder(
      today,
      setup.scheduledCaseDocketNumber,
      {
        jurisdictionRetained: true,
        isCalendared: true,
      },
    );
    openLatestDraftAsDocketClerk(setup.scheduledCaseDocketNumber);
    cy.get('[data-testid="court-issued-document-type-search"]').should(
      'have.text',
      'Order that jurisdiction is retained',
    );
    cy.get('[data-testid="document-description-input"]').should(
      'have.value',
      `. Parties by ${today} shall file a status report. Case is stricken from the current trial session.`,
    );
    cy.get('[data-testid="judge-select"]').should('have.value', 'Colvin');
    cy.get('[data-testid="docket-entry-preview-text"]').should(
      'have.text',
      `Docket entry preview: Order that jurisdiction is retained by Judge Colvin. Parties by ${today} shall file a status report. Case is stricken from the current trial session.`,
    );
  });

  it('should continue to handle OJR and set correct signing judge when status order report is signed by chambers user', () => {
    judgeOrChambersCreatesStatusReportOrder(
      today,
      setup.scheduledCaseDocketNumber,
      {
        jurisdictionRetained: true,
        chambersUser: true,
        isCalendared: true,
      },
    );
    openLatestDraftAsDocketClerk(setup.scheduledCaseDocketNumber);
    cy.get('[data-testid="court-issued-document-type-search"]').should(
      'have.text',
      'Order that jurisdiction is retained',
    );
    cy.get('[data-testid="document-description-input"]').should(
      'have.value',
      `. Parties by ${today} shall file a status report. Case is stricken from the current trial session.`,
    );
    cy.get('[data-testid="judge-select"]').should('have.value', 'Colvin');
    cy.get('[data-testid="docket-entry-preview-text"]').should(
      'have.text',
      `Docket entry preview: Order that jurisdiction is retained by Judge Colvin. Parties by ${today} shall file a status report. Case is stricken from the current trial session.`,
    );
  });
});

function judgeOrChambersCreatesStatusReportOrder(
  today: string,
  docketNumber: string,
  options: {
    jurisdictionRetained?: boolean;
    jurisdictionRestored?: boolean;
    chambersUser?: boolean;
    isCalendared?: boolean;
  } = {},
) {
  const {
    jurisdictionRetained = false,
    jurisdictionRestored = false,
    chambersUser = false,
    isCalendared = false,
  } = options;

  if (chambersUser) {
    loginAsColvinChambers();
  } else {
    loginAsColvin();
  }
  cy.visit(`/case-detail/${docketNumber}`);
  cy.get('#tab-document-view').click();
  cy.contains('Status Report').click();
  cy.get('[data-testid="status-report-order-button"]').click();
  cy.get('[data-testid="order-type-status-report"]').check({ force: true });
  cy.get('#status-report-due-date-picker').type(today);

  if (isCalendared) {
    cy.get('#stricken-from-trial-sessions').should('be.enabled');
    if (jurisdictionRetained) {
      cy.get('#stricken-from-trial-sessions-label').click();
      cy.get('#stricken-from-trial-sessions').should('be.checked');
      cy.get('[data-testid="jurisdiction-retained-label"]').click();
      cy.get('#jurisdiction-retained').check();
    } else if (jurisdictionRestored) {
      cy.get('#stricken-from-trial-sessions-label').click();
      cy.get('#stricken-from-trial-sessions').should('be.checked');
      cy.get('[data-testid="jurisdiction-restored-label"]').click();
      cy.get('#jurisdiction-restored-to-general-docket').check();
    }
  } else {
    cy.get('#stricken-from-trial-sessions').should('be.disabled');
    cy.get('#jurisdiction-retained').should('be.disabled');
    cy.get('#jurisdiction-restored-to-general-docket').should('be.disabled');
  }

  cy.get('[data-testid="save-draft-button"]').click();
  cy.get('[data-testid="sign-pdf-canvas"]').click();
  cy.get('[data-testid="save-signature-button"]').click();
  logout();
}
