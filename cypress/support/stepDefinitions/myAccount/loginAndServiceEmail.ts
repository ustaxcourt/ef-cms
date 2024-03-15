import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { cypressState } from '../../state';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import { login } from '../auth/login';
import { v4 } from 'uuid';

When('I update my login and service email', () => {
  const newEmail = `cypress_test_account+${v4()}@example.com`;

  cypressState.currentUser.pendingEmail = newEmail;

  cy.get('[data-testid="account-menu-button"]').click();
  cy.get('[data-testid="my-account-link"]').click();
  cy.get('[data-testid="change-email-button"]').click();
  cy.get('[data-testid="change-login-email-input"]').type(newEmail);
  cy.get('[data-testid="confirm-change-login-email-input"]').type(newEmail);
  cy.get('[data-testid="save-change-login-email-button"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();

  cy.get('[data-testid="verify-email-warning"]').should(
    'contain',
    'Verify your email to log in and receive service at the new email address',
  );
});

When('I verify my updated email', () => {
  const { email, pendingEmail } = cypressState.currentUser;

  cy.task('getEmailVerificationToken', {
    email,
  }).then(verificationToken => {
    cy.visit(`/verify-email?token=${verificationToken}`);
  });

  cy.get('[data-testid="success-alert"]')
    .should('be.visible')
    .and(
      'contain.text',
      'Your email address is verified. You can now log in to DAWSON.',
    );
  cy.url().should('contain', '/login');

  // The code below will fail on cognito-local
  if (getCypressEnv().env !== 'local') {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(
      getCypressEnv().defaultAccountPass,
    );
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="error-alert"]').contains(
      'The email address or password you entered is invalid.',
    );
  }

  cypressState.currentUser.email = pendingEmail!;
  cypressState.currentUser.pendingEmail = '';

  login({ email });
});

Then('I should see a notification that I need to verify my new email', () => {
  cy.get('[data-testid="verify-email-warning"]').should(
    'contain',
    'Verify your email to log in and receive service at the new email address',
  );
});
