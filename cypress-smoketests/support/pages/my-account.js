const faker = require('faker');

exports.goToMyAccount = () => {
  cy.get('svg.account-menu-icon').parent().parent().click();
  cy.get('button#my-account').click();
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
