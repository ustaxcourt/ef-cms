export function createOrderAndDecision(docketNumber: string) {
  cy.goToRoute(
    `/case-detail/${docketNumber}/create-order?documentTitle=Order%20and%20Decision&documentType=Order%20and%20Decision&eventCode=OAD`,
  );
  cy.get('.ql-editor').click();
  cy.get('[data-testid="save-order-button"]').click();
  cy.get('[data-testid="sign-pdf-canvas"]').click();
  cy.get('[data-testid="save-signature-button"]').click();
  cy.get('[data-testid="success-alert"]');
}
