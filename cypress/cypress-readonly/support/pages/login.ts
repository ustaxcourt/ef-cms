export const login = (token: string) => {
  cy.visit(`/log-in?token=${token}`);
  cy.get('.progress-indicator').should('not.exist');
  cy.get('.big-blue-header').should('exist');
};
