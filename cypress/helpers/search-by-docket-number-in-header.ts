export function searchByDocketNumberInHeader(docketNumber: string) {
  cy.get('#search-field').clear();
  cy.get('#search-field').type(docketNumber);
  cy.get('[data-testid="search-docket-number"]').click();
  cy.get('[data-testid="case-detail-menu-button"]').should('exist');
}
