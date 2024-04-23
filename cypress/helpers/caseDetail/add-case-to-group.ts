export function addCaseToGroup(childDocketNumber: string) {
  cy.get('[data-testid="add-cases-to-group"]').click();
  cy.get('[data-testid="consolidated-case-search"]').type(childDocketNumber);
  cy.get('[data-testid="consolidated-search"]').click();
  cy.get('[data-testid="found-case-label"]').click();
  cy.get('[data-testid="modal-confirm"]').click();
}
