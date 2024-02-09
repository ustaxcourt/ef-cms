import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import {
  loginAsDocketClerk,
  loginAsPetitionsClerk,
} from '../../helpers/auth/login-as-helpers';

describe('Court Issued Documents', { scrollBehavior: 'center' }, () => {
  it('should create a paper petition, serve the petition, and create an order on the petition', () => {
    loginAsPetitionsClerk();
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk();
      cy.get('[data-testid="docket-number-search-input"]').clear();
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();

      cy.goToRoute(
        `/case-detail/${docketNumber}/create-order?documentTitle=Order&documentType=Order&eventCode=O`,
      );
      cy.get('.ql-editor').click();
      cy.get('[data-testid="save-order-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
      cy.get('[data-testid="service-stamp-Served"]').click();
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="print-paper-service-done-button"]').click();
      cy.get('[data-testid="document-viewer-link-O"]').should(
        'have.text',
        'Order',
      );
    });
  });
});
