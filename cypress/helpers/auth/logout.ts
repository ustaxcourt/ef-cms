export function logout() {
  cy.get('[data-testid="account-menu-button"]').click();
  cy.get('[data-testid="logout-button-desktop"]').click();
  cy.get('[data-testid="login-header"]');
}
