import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import {
  loginAsColvin,
  loginAsPetitionsClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { scheduleTrialSession } from 'cypress/helpers/trialSession/schedule-trial-session';
import { calendarTrialSession } from 'cypress/helpers/trialSession/calendar-trial-session';
import { createStatusReport } from 'cypress/helpers/caseDetail/docketRecord/courtIssuedFiling/create-status-report-order';
import { createAndServeConsolidatedGroup } from 'cypress/helpers/fileAPetition/create-consolidated-case-group';

describe('status report order on consolidated cases', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const setup = {
    scheduledCaseDocketNumber: '',
    trialSessionId: '',
  };

  const createScheduledCaseWithStatusReport = (): Cypress.Chainable<string> => {
    return createTrialSession().then(({ trialSessionId }) => {
      setup.trialSessionId = trialSessionId;

      return createAndServeConsolidatedGroup({ numberOfMemberCases: 1 }).then(
        ({ leadDocketNumber }) => {
          createStatusReport(leadDocketNumber);
          updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
          calendarTrialSession(trialSessionId);
          scheduleTrialSession(leadDocketNumber, trialSessionId);

          return cy.wrap(leadDocketNumber);
        },
      );
    });
  };

  before(() => {
    loginAsPetitionsClerk1();

    return createScheduledCaseWithStatusReport().then(scheduledDocketNumber => {
      setup.scheduledCaseDocketNumber = scheduledDocketNumber;
    });
  });

  it('should verify when case is a lead consolidated with all cases is stricken from trial session and jurisdiction is restored', () => {
    judgeOrChambersCreatesStatusReportOrder(
      today,
      setup.scheduledCaseDocketNumber,
      {
        isCalendared: true,
      },
    );
    cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
    cy.get('[data-testid="preview-pdf-button"]').click();

    cy.wait('@courtIssuedOrder').then(({ request }) => {
      const html: string = request.body.contentHtml;
      expect(html).to.include('These consolidated cases are set for trial');
      expect(html).to.include('ORDERED that these cases are stricken');
      expect(html).to.include(
        'ORDERED that these cases are restored to the general docket',
      );
    });
  });
});

function judgeOrChambersCreatesStatusReportOrder(
  today: string,
  docketNumber: string,
  options: {
    isCalendared?: boolean;
  } = {},
) {
  const { isCalendared = false } = options;

  loginAsColvin();

  cy.visit(`/case-detail/${docketNumber}`);
  cy.get('#tab-document-view').click();
  cy.contains('Status Report').click();
  cy.get('[data-testid="status-report-order-button"]').click();
  cy.get('[data-testid="order-type-status-report"]').check({ force: true });
  cy.get('#status-report-due-date-picker').type(today);

  if (isCalendared) {
    cy.get('#stricken-from-trial-sessions').should('be.enabled');
    cy.get('#stricken-from-trial-sessions-label').click();
    cy.get('#stricken-from-trial-sessions').should('be.checked');
    cy.get('[data-testid="jurisdiction-restored-label"]').click();
    cy.get('#jurisdiction-restored-to-general-docket').check();
  } else {
    cy.get('#stricken-from-trial-sessions').should('be.disabled');
    cy.get('#jurisdiction-retained').should('be.disabled');
    cy.get('#jurisdiction-restored-to-general-docket').should('be.disabled');
  }
}
