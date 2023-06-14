import { faker } from '@faker-js/faker';

export const goToMyAccount = () => {
  cy.get('svg.account-menu-icon').parent().parent().click();
  cy.get('button#my-account').click();
};

export const goToEditContactInformation = () => {
  cy.get('button.ustc-button--unstyled').contains('Edit').click();
};

export const updateAddress1 = () => {
  cy.get('.progress-indicator').should('not.exist');
  cy.contains('Edit Contact Information').should('exist');

  cy.get('input[id=contact\\.address1]')
    .clear()
    .type(faker.location.streetAddress());
};

export const saveContactInformation = () => {
  cy.get('button.usa-button').contains('Save').click();
  cy.get('.progress-indicator').should('not.exist');
  cy.get('.progress-user-contact-edit').should('not.exist');
  cy.get('.usa-alert--success').should('exist');
};
