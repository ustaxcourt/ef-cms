/**
 * Logs in as petitionsclerk, finds a case by @docketNumber, and serves the petition
 *
 * aliases:
 *  input:
 *    - @docketNumber - the docket number the respondent should be added to
 *  output: n/a
 */
export function petitionsClerkServesPetition() {
  cy.get('@docketNumber').then(docketNumber => {
    cy.login('petitionsclerk', `case-detail/${docketNumber}`);
  });
  cy.get('button').contains('Petition').click();
  cy.get('a').contains('Review and Serve Petition').click();
  cy.get('#tab-irs-notice').click();
  cy.get('#has-irs-verified-notice-no').click();
  cy.get('button').contains('Review Petition').click();
  cy.get('button').contains('Serve to IRS').click();
  cy.get('button').contains('Yes, Serve').click();
  cy.get('p').contains('Petition served to IRS.').should('exist');
}
