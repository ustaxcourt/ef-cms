/**
 * Logs in as a user and modifies their address with a random string
 *
 * aliases:
 *  input: n/a
 *  output:
 *    - @contactAddress - the new address which is set on the users contact info
 */
export function respondentModifiesContactInfo(userId: string) {
  cy.login(userId, 'user/contact/edit');
  cy.get('input[name="contact.address1"]').clear();
  const newAddress = 'NEW ADDRESS ' + Date.now();
  cy.get('input[name="contact.address1"]').type(newAddress);
  cy.get('button').contains('Save').click();
  cy.get('#progress-description').should('exist');
  cy.get('#progress-description').should('not.exist');
  cy.wrap(newAddress).as('contactAddress');
}
