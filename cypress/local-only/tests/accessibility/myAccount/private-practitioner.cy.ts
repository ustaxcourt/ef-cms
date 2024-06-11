import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('My Account Page - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPrivatePractitioner();
    cy.visit('/my-account');
    cy.contains('My Contact Information');

    cy.runA11y();
  });

  it('should be free of a11y issues when changing email', () => {
    loginAsPrivatePractitioner();
    cy.visit('/change-login-and-service-email');
    cy.get('[data-testid="change-login-email-input"]').should('exist');

    cy.runA11y();
  });
});
