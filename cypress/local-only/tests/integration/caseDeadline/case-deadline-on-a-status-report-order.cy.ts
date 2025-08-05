import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import {
  loginAsColvin,
  loginAsDocketClerk,
  loginAsPetitionsClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createStatusReport } from 'cypress/helpers/caseDetail/docketRecord/courtIssuedFiling/create-status-report-order';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createAndServeConsolidatedGroup } from 'cypress/helpers/fileAPetition/create-consolidated-case-group';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { getLastDraftOrderElementFromDrafts } from 'cypress/local-only/support/statusReportOrder';

describe('Case Deadline Auto Generation from Status Report Order', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const todayDate = formatNow(FORMATS.MMDDYY);
  const futureDate = '01/01/2050';
  const futureDateFormatted = '01/01/50';
  const editDescriptionText = 'test from alex';

  let docketNumber: string;
  let leadDocketNumber: string;
  let memberDocketNumbers: string[];

  before(() => {
    loginAsPetitionsClerk1();

    // create case, serve petition, and create status report order
    createTrialSession().then(() => {
      createAndServePaperPetition().then(({ docketNumber: dn }) => {
        docketNumber = dn;
        createStatusReport(docketNumber);
      });
    });

    // create consolidated case group
    createAndServeConsolidatedGroup({}).then(consolidatedGroupInfo => {
      ({ leadDocketNumber, memberDocketNumbers } = consolidatedGroupInfo);
      createStatusReport(leadDocketNumber);
    });
  });
  it('should generate a deadline when a status report order is filed', () => {
    // create a status report order draft
    loginAsColvin();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-document-view').click();
    cy.contains('button span', 'Status Report').closest('button').click();
    cy.get('[data-testid="status-report-order-button"]').click();
    cy.get('[data-testid="order-type-status-report"]').check({ force: true });
    cy.get('#status-report-due-date-picker').type(today);
    cy.get('[data-testid="save-draft-button"]').click();
    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();

    // add docket entry
    loginAsDocketClerk();
    addDocketEntry(docketNumber);

    // check if case deadline is created
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('[data-testid="tab-tracked-items"]').click();
    cy.get('[data-testid="case-deadline-description"]').should(
      'contain',
      'Status Report Due',
    );
    cy.get('[data-testid="case-deadline-date"]').should('contain', todayDate);

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

  it('should generate a deadline when a status report or proposed stipulated decision order is filed', () => {
    // create a status report or proposed stipulated decision order draft
    loginAsColvin();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-document-view').click();
    cy.contains('button span', 'Status Report').closest('button').click();
    cy.get('[data-testid="status-report-order-button"]').click();
    cy.get(
      '[data-testid="order-type-status-report-or-stipulated-decision"]',
    ).check({ force: true });
    cy.get('#status-report-due-date-picker').type(today);
    cy.get('[data-testid="save-draft-button"]').click();
    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();

    // add docket entry
    loginAsDocketClerk();
    addDocketEntry(docketNumber);

    // check if case deadline is created
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('[data-testid="tab-tracked-items"]').click();
    cy.get(`[data-testid="case-deadline-description"]`).should(
      'contain',
      'Status Report or Proposed Stipulated Decision Due',
    );
    cy.get('[data-testid="case-deadline-date"]').should('contain', todayDate);

    // delete the case deadline
    cy.get('[data-testid="delete-case-deadline-button"]').click();
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('.case-deadline-row').should('not.exist');
  });

  it('should generate deadline for lead and child cases when a status report order for lead case is filed', () => {
    // create a status report order draft
    loginAsColvin();
    cy.visit(`/case-detail/${leadDocketNumber}`);
    cy.get('#tab-document-view').click();
    cy.contains('button span', 'Status Report').closest('button').click();
    cy.get('[data-testid="status-report-order-button"]').click();
    cy.get('[data-testid="order-type-status-report"]').check({ force: true });
    cy.get('#status-report-due-date-picker').type(today);
    cy.get('[data-testid="save-draft-button"]').click();
    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();

    // add docket entry
    loginAsDocketClerk();
    addDocketEntry(leadDocketNumber);

    // check if case deadline is created
    cy.visit(`/case-detail/${leadDocketNumber}`);
    cy.get('[data-testid="tab-tracked-items"]').click();
    cy.get('[data-testid="case-deadline-description"]').should(
      'contain',
      'Status Report Due',
    );
    cy.get('[data-testid="case-deadline-date"]').should('contain', todayDate);

    for (const child of memberDocketNumbers) {
      cy.visit(`/case-detail/${child}`);
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="case-deadline-description"]').should(
        'contain',
        'Status Report Due',
      );
      cy.get('[data-testid="case-deadline-date"]').should('contain', todayDate);
    }
  });
});

const addDocketEntry = (docketNumber: string) => {
  cy.visit(`/case-detail/${docketNumber}`);
  cy.get('[data-testid="tab-drafts"]').click();
  getLastDraftOrderElementFromDrafts().click();
  cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
  cy.get('[data-testid="service-stamp-Served"]').click();
  cy.get('[data-testid="serve-to-parties-btn"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
};
