import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { logout } from '../../../helpers/auth/logout';

Given('I log into DAWSON as {string}', (user: string) => {
  cy.login(user);
});

Given(
  'I log into DAWSON as {string} with {string}',
  (user: string, password: string) => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(`${user}@example.com`);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
  },
);

Given('I logout of DAWSON', () => {
  logout();
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

Then('I should see the login page', () => {
  cy.get('[data-testid="login-header"]');
  cy.url().should('contain', '/login');
});
