/* eslint-disable quotes */
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { v4 } from 'uuid';

Given('I visit forgot password page', () => {
  cy.visit('/login');
  cy.get('[data-testid="forgot-password-button"]').click();
});

When('I enter an email without an account on forgot password page', () => {
  const emailWithoutAccount = `doesNotExist${v4()}@email.com`;
  cy.get('[data-testid="email-input"]').type(emailWithoutAccount);
  cy.get('[data-testid="send-password-reset-button"]').click();
});

When(`I enter {string} on forgot password page`, (email: string) => {
  cy.get('[data-testid="email-input"]').clear();
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="send-password-reset-button"]').click();
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
