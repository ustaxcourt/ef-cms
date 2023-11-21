export function respondentModifiesContactInfo(userId: string) {
  cy.login(userId, 'user/contact/edit');
  cy.get('[data-testid="contact.address1"]').clear();
  const newAddress = 'NEW ADDRESS ' + Date.now();
  cy.get('[data-testid="contact.address1"]').type(newAddress);
  cy.get('[data-testid="save-edit-contact"]').click();
  cy.get('[data-testid="progress-description"]').should('exist');
  cy.get('[data-testid="progress-description"]').should('not.exist');
  return cy.wrap(newAddress);
}
