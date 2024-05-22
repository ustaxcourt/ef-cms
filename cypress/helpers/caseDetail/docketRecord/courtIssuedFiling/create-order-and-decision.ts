export function createOrderAndDecision() {
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-create-order"]').click();
  cy.get('[data-testid="event-code-select"]').select('OAD');
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('.ql-editor').click();
  cy.get('[data-testid="save-order-button"]').click();
  cy.get('[data-testid="sign-pdf-canvas"]').click();
  cy.get('[data-testid="save-signature-button"]').click();
  cy.get('[data-testid="success-alert"]');
}
