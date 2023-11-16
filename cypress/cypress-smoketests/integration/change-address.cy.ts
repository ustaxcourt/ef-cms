import { faker } from '@faker-js/faker';

describe('a private practitioner changes their address', () => {
  it('login as a private practitioner and change their contact information', () => {
    cy.login('privatePractitioner1');
    cy.getByTestId('inbox-tab-content').should('exist');
    cy.getByTestId('account-menu-button').click();
    cy.getByTestId('my-account-link').click();
    cy.getByTestId('edit-contact-info').click();
    cy.getByTestId('contact.address1').clear();
    cy.getByTestId('contact.address1').type(faker.location.streetAddress());
    cy.getByTestId('save-edit-contact').click();
    cy.get('.usa-alert--success').should('exist');
  });
});
