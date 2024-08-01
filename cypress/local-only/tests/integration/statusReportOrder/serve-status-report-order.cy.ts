import {
  docketNumber,
  getLastDraftOrderElementFromDrafts,
} from '../../../support/statusReportOrder';
import {
  loginAsColvin,
  loginAsDocketClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';

describe('serve status report order', () => {
  it('should serve status report order', () => {
    // Create a Status Report Order as a judge
    loginAsColvin();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-document-view').click();
    cy.contains('Status Report').click();
    cy.get('[data-testid="status-report-order-button"]').click();
    cy.get('[data-testid="save-draft-button"]').click();
    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();
    logout();

    // Go to the Status Report Order and serve it as a docket clerk
    loginAsDocketClerk();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-drafts').click();
    getLastDraftOrderElementFromDrafts().click();
    cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
    cy.get('[data-testid="service-stamp-Served"]').click({ force: true });
    cy.get('[data-testid="serve-to-parties-btn"]').click();
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.contains('Document served.').should('exist');
    getLastDraftOrderElementFromDrafts().should('exist');
  });
});
