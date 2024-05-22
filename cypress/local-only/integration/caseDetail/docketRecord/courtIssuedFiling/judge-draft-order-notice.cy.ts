import { createOrderAndDecision } from '../../../../../helpers/caseDetail/docketRecord/courtIssuedFiling/create-order-and-decision';
import { goToCase } from '../../../../../helpers/caseDetail/go-to-case';

describe('Judge Draft Order or Notice', () => {
  describe('Bug Fixes', () => {
    it('should allow judge to edit order that has had a signature removed', () => {
      cy.login('judgecolvin');
      goToCase('999-15');
      createOrderAndDecision();
      cy.get('[data-testid="remove-signature-docket-entry-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="draft-edit-button-not-signed"]').click();
      cy.get('[data-testid="save-order-button"]').should('exist');
    });
  });
});
