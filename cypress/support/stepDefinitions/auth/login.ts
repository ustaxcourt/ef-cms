import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';

Given('I log into DAWSON as {string}', (username: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(`${username}@example.com`);
  cy.get('[data-testid="password-input"]').type(
    getCypressEnv().defaultAccountPass,
  );
  cy.get('[data-testid="login-button"]').click();
});

Given(
  'I log into DAWSON as {string} with {string}',
  (username: string, password: string) => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(`${username}@example.com`);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
  },
);

Given('I logout of DAWSON', () => {
  cy.get('[data-testid="account-menu-button"]').click();
  cy.get('[data-testid="logout-button-desktop"]').click();
});

When('I visit the login page', () => {
  cy.visit('/login');
});

When('I logout of DAWSON from a {string} device', (devicetype: string) => {
  if (devicetype === 'mobile') {
    cy.get('[data-testid="account-menu-button-mobile"]').click();
    cy.get('[data-testid="logout-button-mobile"]').click();
  } else {
    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="logout-button-desktop"]').click();
  }
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

Then('I should be able to log in as {string}', (username: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(`${username}@example.com`);
  cy.get('[data-testid="password-input"]').type(
    getCypressEnv().defaultAccountPass,
  );
  cy.get('[data-testid="login-button"]').click();
});
