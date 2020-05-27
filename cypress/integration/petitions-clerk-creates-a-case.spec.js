const {
  getCreateACaseButton,
  navigateTo: navigateToDocumentQC,
} = require('../support/pages/document-qc');

const {
  fillInCreateCaseFromPaperForm,
} = require('../support/pages/create-paper-petition');

describe('Create case and submit to IRS', function () {
  before(() => {
    cy.task('seed');

    navigateToDocumentQC('petitionsclerk');

    getCreateACaseButton().click();
  });

  it('should display parties tab when user navigates to create a case', () => {
    const partiesTabElement = cy.get('#tab-parties');
    partiesTabElement.should('have.attr', 'aria-selected');

    fillInCreateCaseFromPaperForm();

    cy.server();
    cy.route('POST', '**/paper').as('postPaperCase');
    cy.get('#submit-case').click();
    cy.wait('@postPaperCase');
    cy.get('@postPaperCase').should(xhr => {
      expect(xhr.responseBody).to.have.property('docketNumber');
    });
  });
});
