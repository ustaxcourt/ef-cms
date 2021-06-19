const {
  getCreateACaseButton,
  navigateTo: navigateToDocumentQC,
} = require('../support/pages/document-qc');

const {
  fillInCreateCaseFromPaperForm,
} = require('../support/pages/create-paper-petition');

describe('Create case and submit to IRS', function () {
  before(() => {
    navigateToDocumentQC('petitionsclerk');

    getCreateACaseButton().click();
  });

  it('should display parties tab when user navigates to create a case', () => {
    cy.get('#tab-parties').parent().should('have.attr', 'aria-selected');

    fillInCreateCaseFromPaperForm();

    cy.intercept('POST', '**/paper').as('postPaperCase');
    cy.get('#submit-case').click();
    cy.wait('@postPaperCase').then(({ response }) => {
      expect(response.body).to.have.property('docketNumber');
    });
  });

  it('should display a confirmation modal when the user clicks cancel on the review page', () => {
    cy.get('button#cancel-create-case').scrollIntoView().click();
    cy.get('div.modal-header').should('exist');
  });

  it('should route to Document QC inbox when the user confirms to cancel', () => {
    cy.get('button.modal-button-confirm').scrollIntoView().click();
    cy.url().should('include', 'document-qc/my/inbox');
  });
});
