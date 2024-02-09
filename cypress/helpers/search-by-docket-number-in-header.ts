export function searchByDocketNumberInHeader(docketNumber: string) {
  cy.get('[data-testid="docket-number-search-input"]').scrollIntoView().clear();
  cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
  cy.get('[data-testid="search-docket-number"]').click();
  cy.get('[data-testid="case-detail-menu-button"]').should('exist');
}
