import { login } from 'cypress/helpers/authentication/login-as-helpers';

export function respondentModifiesContactInfo(email: string) {
  login({ email });
  cy.visit('user/contact/edit')
  cy.get('[data-testid="contact.address1"]').clear();
  const newAddress = 'NEW ADDRESS ' + Date.now();
  cy.get('[data-testid="contact.address1"]').type(newAddress);
  cy.get('[data-testid="save-edit-contact"]').click();
  cy.get('[data-testid="progress-description"]').should('exist');
  cy.get('[data-testid="progress-description"]').should('not.exist');
  return cy.wrap(newAddress);
}
