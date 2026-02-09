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
      cy.get('.ql-editor').type('this is a test order');
      cy.get('[data-testid="save-order-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      //   our code here
      cy.window().then((win: Window & { pdfjsObj?: unknown }) => {
        console.log('WIN: ', win);
        // delete win.pdfjsObj;
        cy.get('[data-testid="save-signature-button"]').click();
      });
    });
  });
});
