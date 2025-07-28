import { formatNow, FORMATS } from "@shared/business/utilities/DateHandler";
import { loginAsColvin, loginAsDocketClerk, loginAsPetitionsClerk1 } from "cypress/helpers/authentication/login-as-helpers";
import { createStatusReport } from "cypress/helpers/caseDetail/docketRecord/courtIssuedFiling/create-status-report-order";
import { createAndServePaperPetition } from "cypress/helpers/fileAPetition/create-and-serve-paper-petition";
import { createTrialSession } from "cypress/helpers/trialSession/create-trial-session";
import { getLastDraftOrderElementFromDrafts } from "cypress/local-only/support/statusReportOrder";

describe('Case Deadline Auto Generation from Status Report Order', () => {
  const today = formatNow(FORMATS.MMDDYYYY);

  let docketNumber: string;

  before(() => {
    loginAsPetitionsClerk1();

    // create case, serve petition, and create status report order
    createTrialSession().then(() => {
      createAndServePaperPetition().then(({ docketNumber: dn }) => {
        docketNumber = dn;
        createStatusReport(docketNumber);
      });
    });
  })
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
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('[data-testid="tab-drafts"]').click();
    getLastDraftOrderElementFromDrafts().click();
    cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
    cy.get('[data-testid="service-stamp-Served"]').click();
    cy.get('[data-testid="serve-to-parties-btn"]').click();
    cy.get('[data-testid="modal-button-confirm"]').click();

    // check if case deadline is created
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('[data-testid="tab-tracked-items"]').click();
    cy.get('[data-testid="case-deadline-description"]').should('contain', 'Status Report');
  });
});