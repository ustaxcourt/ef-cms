export function respondentModifiesContactInfo(irsUser: string) {
  cy.login(irsUser, 'user/contact/edit');
  cy.get('input[name="contact.address1"]').clear();
  const newAddress = 'NEW ADDRESS ' + Date.now();
  cy.get('input[name="contact.address1"]').type(newAddress);
  cy.get('button').contains('Save').click();
  cy.get('#progress-description').should('exist');
  cy.get('#progress-description').should('not.exist');
  cy.wrap(newAddress).as('contactAddress');
}
