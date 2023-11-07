/**
 * Logs in as petitionsclerk, finds a case by @docketNumber, and adds a respondent to the case
 */
export function petitionsclerkAddsRespondentToCase(barNumber: string) {
  cy.get('@docketNumber').then(docketNumber => {
    cy.login('petitionsclerk', `case-detail/${docketNumber}`);
    cy.get('button').contains('Case Information').click();
    cy.get('button').contains('Parties').click();
    cy.get('button').contains('Respondent Counsel').click();
    cy.get('#respondent-search-field').type(barNumber);
    cy.get('#search-for-respondent').click();
    cy.get('button').contains('Add to Case').click();
    cy.get('p').contains('Respondent counsel added to case').should('exist');
    cy.get('h3').contains(barNumber).should('exist');
  });
}
