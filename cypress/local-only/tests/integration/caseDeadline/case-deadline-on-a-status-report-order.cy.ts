import {
  createISODateString,
  formatNow,
  FORMATS,
  getBusinessDateInFuture,
} from '@shared/business/utilities/DateHandler';
import {
  loginAsColvin,
  loginAsDocketClerk,
  loginAsPetitionsClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createStatusReport } from 'cypress/helpers/caseDetail/docketRecord/courtIssuedFiling/create-status-report-order';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createAndServeConsolidatedGroup } from 'cypress/helpers/fileAPetition/create-consolidated-case-group';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { getLastDraftOrderElementFromDrafts } from 'cypress/local-only/support/statusReportOrder';

describe('Case Deadline Auto Generation from Status Report Order', () => {
  const todayDate = formatNow(FORMATS.MMDDYYYY);
  const todayDateFormatted = formatNow(FORMATS.MMDDYY);
  const futureDate = getBusinessDateInFuture({
    numberOfDays: 30,
    outputFormat: FORMATS.MMDDYYYY,
    startDate: createISODateString(todayDate, FORMATS.MMDDYYYY),
  });
  const futureDateFormatted = getBusinessDateInFuture({
    numberOfDays: 30,
    outputFormat: FORMATS.MMDDYY,
    startDate: createISODateString(todayDate, FORMATS.MMDDYYYY),
  });
  const editDescriptionText = 'test from alex';

  it('should generate a deadline when a status report order is filed', () => {
    setupSingleCase().then(({ docketNumber }) => {
      // create a status report order draft
      loginAsColvin();
      goToCase(docketNumber);
      cy.get('#tab-document-view').click();
      cy.contains('button span', 'Status Report').closest('button').click();
      cy.get('[data-testid="status-report-order-button"]').click();
      cy.get('[data-testid="order-type-status-report"]').check({ force: true });
      cy.get('#status-report-due-date-picker').type(todayDate);
      cy.get('[data-testid="save-draft-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
      cy.get('[data-testid="success-alert"]').contains('Order updated.');

      // add docket entry
      loginAsDocketClerk();
      addDocketEntry(docketNumber);

      // check if case deadline is created
      goToCase(docketNumber);
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="case-deadline-description"]').should(
        'contain',
        'Status Report Due',
      );
      cy.get('[data-testid="case-deadline-date"]').should(
        'contain',
        todayDateFormatted,
      );

      // check if edit functionality works
      cy.get('[data-testid="case-deadline-edit-button"]').click();
      cy.get('#deadline-date-picker').clear();
      cy.get('#deadline-date-picker').type(futureDate);
      cy.get('[data-testid="case-deadline-description-input"]').clear();
      cy.get('[data-testid="case-deadline-description-input"]').type(
        editDescriptionText,
      );
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="case-deadline-date"]').should(
        'contain',
        futureDateFormatted,
      );
      cy.get('[data-testid="case-deadline-description"]').should(
        'contain',
        editDescriptionText,
      );

      // delete the case deadline
      cy.get('[data-testid="delete-case-deadline-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('.case-deadline-row').should('not.exist');
    });
  });

  it('should generate a deadline when a status report or proposed stipulated decision order is filed', () => {
    setupSingleCase().then(({ docketNumber }) => {
      // create a status report or proposed stipulated decision order draft
      loginAsColvin();
      goToCase(docketNumber);
      cy.get('#tab-document-view').click();
      cy.contains('button span', 'Status Report').closest('button').click();
      cy.get('[data-testid="status-report-order-button"]').click();
      cy.get(
        '[data-testid="order-type-status-report-or-stipulated-decision"]',
      ).check({ force: true });
      cy.get('#status-report-due-date-picker').type(todayDate);
      cy.get('[data-testid="save-draft-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
      cy.get('[data-testid="success-alert"]').contains('Order updated.');

      // add docket entry
      loginAsDocketClerk();
      addDocketEntry(docketNumber);

      // check if case deadline is created
      goToCase(docketNumber);
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get(`[data-testid="case-deadline-description"]`).should(
        'contain',
        'Status Report or Proposed Stipulated Decision Due',
      );
      cy.get('[data-testid="case-deadline-date"]').should(
        'contain',
        todayDateFormatted,
      );

      // delete the case deadline
      cy.get('[data-testid="delete-case-deadline-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('.case-deadline-row').should('not.exist');
    });
  });

  it('should generate deadline for lead and child cases when a status report order for lead case is filed', () => {
    setupConsolidatedGroup().then(({ leadDocketNumber, memberDocketNumbers }) => {
      // create a status report order draft
      loginAsColvin();
      goToCase(leadDocketNumber);
      cy.get('#tab-document-view').click();
      cy.contains('button span', 'Status Report').closest('button').click();
      cy.get('[data-testid="status-report-order-button"]').click();
      cy.get('[data-testid="order-type-status-report"]').check({ force: true });
      cy.get('#status-report-due-date-picker').type(todayDate);
      cy.get('[data-testid="save-draft-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
      cy.get('[data-testid="success-alert"]').contains('Order updated.');

      // add docket entry
      loginAsDocketClerk();
      addDocketEntry(leadDocketNumber);

      // check if case deadline is created
      goToCase(leadDocketNumber);
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="case-deadline-description"]').should(
        'contain',
        'Status Report Due',
      );
      cy.get('[data-testid="case-deadline-date"]').should(
        'contain',
        todayDateFormatted,
      );

      for (const child of memberDocketNumbers) {
        goToCase(child);
        cy.get('[data-testid="tab-tracked-items"]').click();
        cy.get('[data-testid="case-deadline-description"]').should(
          'contain',
          'Status Report Due',
        );
        cy.get('[data-testid="case-deadline-date"]').should(
          'contain',
          todayDateFormatted,
        );
      }
    });
  });
});

// Helpers to make each test self-contained and avoid shared state
const setupSingleCase = () => {
  loginAsPetitionsClerk1();
  return createTrialSession()
    .then(() => createAndServePaperPetition())
    .then(({ docketNumber }) => {
      createStatusReport(docketNumber);
      return cy.wrap({ docketNumber });
    });
};

const setupConsolidatedGroup = () => {
  loginAsPetitionsClerk1();
  return createAndServeConsolidatedGroup({}).then(
    ({ leadDocketNumber, memberDocketNumbers }) => {
      createStatusReport(leadDocketNumber);
      return cy.wrap({ leadDocketNumber, memberDocketNumbers });
    },
  );
};

const addDocketEntry = (docketNumber: string) => {
  goToCase(docketNumber);
  cy.get('[data-testid="tab-drafts"]').click();
  getLastDraftOrderElementFromDrafts().click();
  cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
  cy.get('[data-testid="service-stamp-Served"]').click();
  cy.get('[data-testid="serve-to-parties-btn"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
};
