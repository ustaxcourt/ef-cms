import { faker } from '@faker-js/faker';

export const goToMyAccount = () => {
  cy.get('svg.account-menu-icon').parent().parent().click();
  cy.get('button#my-account').click();
};

export const clickChangeEmail = () => {
  cy.get('button').contains('Change Email').click();
};

export const changeEmailTo = newEmail => {
  cy.get('input[name="email"]').type(newEmail);
  cy.get('input[name="confirmEmail"]').type(newEmail);
  cy.get('button').contains('Save').click();
};

export const clickConfirmModal = () => {
  cy.get('button.modal-button-confirm').click();
};

export const confirmEmailPendingAlert = () => {
  cy.get('.verify-email-notification').should('exist');
};

export const goToEditContactInformation = () => {
  cy.get('button.ustc-button--unstyled').contains('Edit').click();
};

export const updateAddress1 = () => {
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
