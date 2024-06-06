import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Edit Case Details - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('When petition payment status is paid', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19/edit-details');
      cy.get('[data-testid="payment-status-paid-radio"]').click();

      cy.runA11y();
    });
  });

  describe('When petition payment status is unpaid', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19/edit-details');
      cy.get('[data-testid="payment-status-unpaid-radio"]').click();

      cy.runA11y();
    });
  });

  describe('When petition payment status is waived', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19/edit-details');
      cy.get('[data-testid="payment-status-waived-radio"]').click();

      cy.runA11y();
    });
  });
});
