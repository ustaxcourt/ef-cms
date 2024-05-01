export function updateCaseStatus(status: string, judge: string) {
  cy.get('[data-testid="tab-case-information"]').click();
  cy.get('[data-testid="menu-edit-case-context-button"]').click();
  cy.get('[data-testid="case-status-select"]').select(status);
  cy.get('[data-testid="associated-judge-select"]').select(judge);
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('[data-testid="success-alert"]').should('be.visible');
}
