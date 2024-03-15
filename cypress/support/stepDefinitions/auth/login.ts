import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { cypressState } from '../../state';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';

Given('I log into DAWSON with my new password {string}', (password: string) => {
  const { email } = cypressState.currentUser;

  goToLogin();
  login({ email, passwordOverride: password });
});

Given('I log into DAWSON as {string}', (username: string) => {
  goToLogin();
  login({ email: `${username}@example.com` });
});

Given('I log into DAWSON', () => {
  const { email } = cypressState.currentUser;

  goToLogin();
  login({ email });
});

Given('I log into DAWSON with an incorrect password', () => {
  const { email } = cypressState.currentUser;
  const incorrectPassword = 'IncorrectPassword!1';

  goToLogin();
  login({
    email,
    passwordOverride: incorrectPassword,
  });
});

When('I visit the login page', () => {
  goToLogin();
});

Then('I should see my dashboard', () => {
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
});

Then('I should see the petitioner dashboard', () => {
  cy.get('[data-testid="my-cases-link"]');
});

Then('I should see the practitioner dashboard', () => {
  cy.get('[data-testid="my-cases-link"]');
});

Then('I should see the login page', () => {
  cy.get('[data-testid="login-header"]');
  cy.url().should('contain', '/login');
});

Then('I should see an alert that my email address is not verified', () => {
  cy.get('[data-testid="error-alert"]').should(
    'contain',
    'Email address not verified',
  );
});

Then(
  'I should see an alert that my email address or password is invalid',
  () => {
    cy.get('[data-testid="error-alert"]').should(
      'contain',
      'The email address or password you entered is invalid',
    );
  },
);

Then('I should be able to log in', () => {
  const { email } = cypressState.currentUser;

  login({ email });
});

function goToLogin() {
  cy.visit('/login');
}

export function login({
  email,
  passwordOverride,
}: {
  email: string;
  passwordOverride?: string;
}) {
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(
    passwordOverride || getCypressEnv().defaultAccountPass,
  );
  cy.get('[data-testid="login-button"]').click();
}
