export function petitionsclerkAddsRespondentToCase(
  docketNumber: string,
  barNumber: string,
) {
  cy.login('petitionsclerk1', `case-detail/${docketNumber}`);
  cy.getByTestId('tab-case-information').click();
  cy.getByTestId('tab-parties').click();
  cy.getByTestId('respondent-counsel').click();
  cy.getByTestId('respondent-search-field').type(barNumber);
  cy.getByTestId('search-for-respondent').click();
  cy.getByTestId('modal-button-confirm').click();
  cy.getByTestId('success-alert').should('exist');
  cy.getByTestId('respondent-counsel-name').contains(barNumber).should('exist');
}
