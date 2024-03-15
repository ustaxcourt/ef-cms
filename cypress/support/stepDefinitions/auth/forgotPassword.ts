import { DEFAULT_FORGOT_PASSWORD_CODE } from '../../cognito-login';
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { cypressState } from '../../state';
import { v4 } from 'uuid';
import { verifyPasswordRequirements } from '../../../helpers/auth/verify-password-requirements';

Given('I visit forgot password page', () => {
  cy.visit('/login');
  cy.get('[data-testid="forgot-password-button"]').click();
});

Given('I request a new forgot password code', () => {
  cy.get('[data-testid="request-new-forgot-password-code-button"]').click();
});

Given('I successfully reset my password to {string}', (newPassword: string) => {
  cy.get('[data-testid="forgot-password-code"]').type(
    DEFAULT_FORGOT_PASSWORD_CODE,
  );
  cy.get('[data-testid="new-password-input"]').clear();
  cy.get('[data-testid="new-password-input"]').type(newPassword);
  cy.get('[data-testid="confirm-new-password-input"]').clear();
  cy.get('[data-testid="confirm-new-password-input"]').type(newPassword);
  cy.get('[data-testid="change-password-button"]').click();
});

When('I enter an email without an account on forgot password page', () => {
  const emailWithoutAccount = `doesNotExist${v4()}@email.com`;

  cy.get('[data-testid="email-input"]').type(emailWithoutAccount);
  cy.get('[data-testid="send-password-reset-button"]').click();
});

When('I enter my email on the forgot password page', () => {
  const { email } = cypressState.currentUser;

  cy.get('[data-testid="email-input"]').clear();
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="send-password-reset-button"]').click();
});

When('I request a password reset for my account', () => {
  const { email } = cypressState.currentUser;

  cy.visit('/login');
  cy.get('[data-testid="forgot-password-button"]').click();
  cy.get('[data-testid="email-input"]').clear();
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="send-password-reset-button"]').click();
  cy.get('[data-testid="success-alert"]').should(
    'contain',
    'Password reset code sent',
  );
});

When('I enter my forgot password code', () => {
  cy.get('[data-testid="change-password-button"]').should('be.disabled');

  verifyPasswordRequirements('[data-testid="new-password-input"]');

  cy.get('[data-testid="forgot-password-code"]').type(
    DEFAULT_FORGOT_PASSWORD_CODE,
  );
});

When('I enter a new password of {string}', (newPassword: string) => {
  cy.get('[data-testid="new-password-input"]').clear();
  cy.get('[data-testid="new-password-input"]').type(newPassword);
  cy.get('[data-testid="confirm-new-password-input"]').clear();
  cy.get('[data-testid="confirm-new-password-input"]').type(newPassword);
  cy.get('[data-testid="change-password-button"]').click();
});

When('I enter an incorrect or expired forgot password code', () => {
  cy.get('[data-testid="forgot-password-code"]').type('totally incorrect code');
});

Then('I should see an alert that a password reset code has been sent', () => {
  cy.get('[data-testid="success-alert"]').should(
    'contain',
    'Password reset code sent',
  );
});

Then('I should see an alert that a confirmation email was resent', () => {
  cy.get('[data-testid="warning-alert"]').should(
    'contain',
    'We’ve sent you an email',
  );
});

Then(
  'I should see an alert that I have entered an invalid password reset code',
  () => {
    cy.get('[data-testid="error-alert"]').should(
      'contain',
      'Invalid verification code',
    );
  },
);
