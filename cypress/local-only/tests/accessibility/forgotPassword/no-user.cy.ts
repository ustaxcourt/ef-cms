import {
  VALID_PASSWORD_CONFIG,
  generatePassword,
} from '../../../../helpers/authentication/generate-password';
import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { createAPetitioner } from '../../../../helpers/accountCreation/create-a-petitioner';

describe('Forgot Password - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/forgot-password');

    cy.get('[data-testid="email-input"]');

    checkA11y();
  });

  it('should be free of a11y issues when resetting password', () => {
    const email = `example${Date.now()}@pa11y.com`;
    createAPetitioner({
      email,
      name: 'pa11y',
      password: generatePassword(VALID_PASSWORD_CONFIG),
    });

    cy.visit('/forgot-password');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="send-password-reset-button"]').click();
    cy.contains('We’ve sent you an email');

    checkA11y();
  });
});
