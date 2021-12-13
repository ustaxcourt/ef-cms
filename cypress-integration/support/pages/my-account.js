const faker = require('faker');

exports.goToMyAccount = () => {
  cy.get('svg.account-menu-icon').parent().parent().click();
  cy.get('button#my-account').click();
};

exports.clickChangeEmail = () => {
  cy.get('button').contains('Change Email').click();
};

exports.changeEmailTo = newEmail => {
  cy.get('input[name="email"]').type(newEmail);
  cy.get('input[name="confirmEmail"]').type(newEmail);
  cy.get('button').contains('Save').click();
};

exports.clickConfirmModal = () => {
  cy.get('button.modal-button-confirm').click();
};

exports.confirmEmailPendingAlert = () => {
  cy.get('.verify-email-notification').should('exist');
};

exports.goToEditContactInformation = () => {
  cy.get('button.ustc-button--unstyled').contains('Edit').click();
};

exports.updateAddress1 = () => {
  cy.get('input[id=contact\\.address1]')
    .clear()
    .type(faker.address.streetAddress());
};

exports.saveContactInformation = () => {
  cy.get('button.usa-button').contains('Save').click();

  cy.get('.progress-indicator').should('not.exist');
  cy.get('.progress-user-contact-edit').should('not.exist');
  cy.get('.usa-alert--success').should('exist');
};
