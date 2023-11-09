export function respondentModifiesContactInfo(userId: string) {
  cy.login(userId, 'user/contact/edit');
  cy.getByTestId('contact.address1').clear();
  const newAddress = 'NEW ADDRESS ' + Date.now();
  cy.getByTestId('contact.address1').type(newAddress);
  cy.getByTestId('save-edit-contact').click();
  cy.getByTestId('progress-description').should('exist');
  cy.getByTestId('progress-description').should('not.exist');
  return cy.wrap(newAddress);
}
