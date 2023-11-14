export function petitionsClerkServesPetition(docketNumber: string) {
  cy.login('petitionsclerk', `case-detail/${docketNumber}`);
  cy.getByTestId('document-viewer-link-P').click();
  cy.getByTestId('review-and-serve-petition').click();
  cy.getByTestId('tab-irs-notice').click();
  cy.getByTestId('has-irs-verified-notice-no').click();
  cy.getByTestId('submit-case').click();
  cy.getByTestId('serve-case-to-irs').click();
  cy.getByTestId('modal-confirm').click();
  cy.getByTestId('success-alert').should('exist');
}
