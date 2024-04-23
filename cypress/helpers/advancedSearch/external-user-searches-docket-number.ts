export function externalUserSearchesDocketNumber(docketNumber: string) {
  cy.get('[data-testid="docket-search-field"]').type(docketNumber);
  cy.get('[data-testid="search-by-docket-number"]').click();
}
