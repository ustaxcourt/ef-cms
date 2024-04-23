import { createOrderAndDecision } from '../../../../../helpers/create-order-and-decision';
import { searchByDocketNumberInHeader } from '../../../../../helpers/search-by-docket-number-in-header';

describe('Judge Draft Order or Notice', () => {
  describe('Bug Fixes', () => {
    it('should allow judge to edit order that has had a signature removed', () => {
      cy.login('judgecolvin');
      searchByDocketNumberInHeader('999-15');
      createOrderAndDecision();
      cy.get('[data-testid="remove-signature-docket-entry-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="draft-edit-button-not-signed"]').click();
      cy.get('[data-testid="save-order-button"]').should('exist');
    });
  });
});
