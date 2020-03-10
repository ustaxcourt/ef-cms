const {
  getCreateACaseButton,
  navigateTo: navigateToDocumentQC,
} = require('../support/pages/document-qc');

const {
  fillInCreateCaseFromPaperForm,
  getPartiesTab,
  getReviewCaseButton,
} = require('../support/pages/create-paper-petition');

describe('Create case and submit to IRS', function() {
  before(() => {
    cy.task('seed');

    navigateToDocumentQC('petitionsclerk');

    getCreateACaseButton().click();
  });

  it('should display parties tab when user navigates to create a case', () => {
    const partiesTabElement = getPartiesTab();
    partiesTabElement.should('have.attr', 'aria-selected');

    fillInCreateCaseFromPaperForm();

    getReviewCaseButton().click();
  });

  it('should display a create case header', () => {
    const banner = cy.get('.big-blue-header');
    banner.contains('Create Case');
  });

  it('should display a tile for party information, case information, irs notice, and attachments each with edit buttons', () => {
    cy.get('#parties-card')
      .contains('Parties')
      .find('button');
    cy.get('#case-information-card')
      .contains('Case Information')
      .find('button');
    cy.get('#irs-notice-card')
      .contains('IRS Notice')
      .find('button');
    cy.get('#attachments-card')
      .contains('Attachments')
      .find('button');
  });

  it('should display serve to irs button', () => {
    cy.get('#submit-case').should('exist');
  });
});
