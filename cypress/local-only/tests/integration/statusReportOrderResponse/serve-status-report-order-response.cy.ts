import { docketNumber } from '../../../support/statusReportOrderResponse';
import {
  loginAsColvin,
  loginAsDocketClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';

describe('serve status report order response', () => {
  it('should serve status report order response', () => {
    // Create a Status Report Order Response as a judge
    loginAsColvin();
    const orderName = 'Serve Status Report Order Test';
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-document-view').click();
    cy.contains('Status Report').click();
    cy.get('[data-testid="order-response-button"]').click();
    cy.get('#docket-entry-description').clear();
    cy.get('#docket-entry-description').type(orderName);
    cy.get('[data-testid="save-draft-button"]').click();
    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();
    logout();

    // Go to the Status Report Order Response and serve it as a docket clerk
    loginAsDocketClerk();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-drafts').click();
    cy.contains('button', orderName).click();
    cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
    cy.get('[data-testid="service-stamp-Served"]').click({ force: true });
    cy.get('[data-testid="serve-to-parties-btn"]').click();
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.contains('Document served.').should('exist');
    cy.contains('button', orderName).should('exist');
  });
});
