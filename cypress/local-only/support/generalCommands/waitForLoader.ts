export function waitForLoadingComplete() {
  cy.get('.progress-indicator');
  cy.get('.progress-indicator').should('not.exist');
}
