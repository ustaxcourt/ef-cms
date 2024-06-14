import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('My Account Page - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();
    cy.visit('/my-account');
    cy.contains('Login & Service Email Address');

    checkA11y();
  });

  it('should be free of a11y issues when changing email', () => {
    loginAsPetitioner();
    cy.visit('/change-login-and-service-email');
    cy.get('[data-testid="change-login-email-input"]').should('exist');

    checkA11y();
  });
});
