export function loginAsTestAdmissionsClerk() {
  cy.login('testAdmissionsClerk');
  cy.get('#inbox-tab-content').should('exist');
}
