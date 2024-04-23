import { createAndServePaperPetition } from '../../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import {
  loginAsDocketClerk1,
  loginAsPetitionsClerk1,
} from '../../../../../helpers/authentication/login-as-helpers';

describe('Court Issued Documents', { scrollBehavior: 'center' }, () => {
  it('should create a paper petition, serve the petition, and create an order on the petition', () => {
    loginAsPetitionsClerk1();
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk1();
      cy.get('[data-testid="docket-number-search-input"]').clear();
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();

      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-create-order"]').click();
      cy.get('[data-testid="event-code-select"]').select('O');
      cy.get('[data-testid="create-order-document-title"]').clear();
      cy.get('[data-testid="create-order-document-title"]').type('Order');
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="create-order-page-title"]');
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
