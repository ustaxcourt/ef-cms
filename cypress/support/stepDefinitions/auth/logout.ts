import { Given, When } from '@badeball/cypress-cucumber-preprocessor';

export function logout() {
  cy.get('[data-testid="account-menu-button"]').click();
  cy.get('[data-testid="logout-button-desktop"]').click();
  cy.get('[data-testid="login-header"]');
}

Given('I logout of DAWSON', () => {
  logout();
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
