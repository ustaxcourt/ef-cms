export const login = token => {
  cy.visit(`/log-in?token=${token}`);
  cy.waitUntilSettled(50);
  cy.get('.progress-indicator').should('not.exist');
};
