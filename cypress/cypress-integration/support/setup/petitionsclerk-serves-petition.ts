export function petitionsClerkServesPetition(docketNumber: string) {
  cy.login('petitionsclerk', `case-detail/${docketNumber}`);
  cy.get('[data-testid="document-viewer-link-P"]').click();
  cy.get('[data-testid="review-and-serve-petition"]').click();
  cy.get('[data-testid="tab-irs-notice"]').click();
  cy.get('[data-testid="has-irs-verified-notice-no"]').click();
  cy.get('[data-testid="submit-case"]').click();
  cy.get('[data-testid="serve-case-to-irs"]').click();
  cy.get('[data-testid="modal-confirm"]').click();
  cy.get('[data-testid="success-alert"]').should('exist');
}
