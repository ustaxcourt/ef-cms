import { externalUserCreatesElectronicCase } from '../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../../helpers/documentQC/petitionsclerk-serves-petition';

if (!Cypress.env('SMOKETESTS_LOCAL')) {
  describe('BUG: order that was served gets unserved', () => {
    before(() => {
      loginAsPetitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        cy.wrap(docketNumber).as('DOCKET_NUMBER');
        petitionsClerkServesPetition(docketNumber);
      });
    });

    beforeEach(() => {
      cy.keepAliases();
    });

    it('should not unserve an order that has been served', () => {
      loginAsDocketClerk1();
      cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
        console.log('docketNumber', docketNumber);
        goToCase(docketNumber);
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
        cy.get('[data-testid="save-signature-button"]').click();
        cy.get('[data-testid="signature-required-label"]').should('not.exist');
        cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
        cy.get('[data-testid="service-stamp-Served"]').click();
        cy.get('[data-testid="serve-to-parties-btn"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="success-alert"]').should('exist');

        const threeMinutes = 4 * 60 * 1000;
        cy.wait(threeMinutes);

        cy.reload(true);
        cy.get('[data-testid="tab-drafts"]').click();
        cy.get('[data-testid="view-full-pdf-button"]').should('exist');
        cy.get('[data-testid="docket-entry-description-1"]').should(
          'not.exist',
        );
      });
    });
  });
} else {
  describe('BUG: order that was served gets unserved', () => {
    it('should not run this test because this only covers behavior around a deployed environment', () => {
      expect(true).to.equal(true);
    });
  });
}
