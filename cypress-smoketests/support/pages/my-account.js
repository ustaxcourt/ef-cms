const faker = require('faker');

exports.goToMyAccount = () => {
  cy.get('svg.account-menu-icon').parent().parent().click();
  cy.get('button#my-account').click();
};

exports.goToEditContactInformation = () => {
  cy.get('button.ustc-button--unstyled').contains('Edit').click();
};

exports.updateAddress1 = () => {
  cy.get('.progress-indicator').should('not.exist');
  cy.contains('Edit Contact Information').should('exist');

  cy.get('input[id=contact\\.address1]')
    .clear()
    .type(faker.address.streetAddress());
};

exports.saveContactInformation = () => {
  cy.get('button.usa-button').contains('Save').click();

  // when the practitioner has very little open cases, the progress bar is too quick and
  // is gone before cypress has time to check it
  cy.get('body').then($body => {
    // synchronously query for element
    if (!$body.find('.usa-alert--success').length) {
      // the progress bar will take a while to finish when practitioner has too many open cases, so
      // we check these intervals to prevent the cy.get('.progress-indicator').should('not.exist'); from timing out.
      [25, 50, 75].forEach(expectedValue => {
        cy.get('.progress-text').should(div => {
          expect(parseInt(div.get(0).innerText.split('%')[0])).to.gt(
            expectedValue,
          );
        });
      });
    }
  });

  cy.get('.progress-indicator').should('not.exist');
  cy.get('.progress-user-contact-edit').should('not.exist');
  cy.get('.usa-alert--success').should('exist');
};
