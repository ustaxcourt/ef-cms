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

    // Log in as a petitions clerk
    // Navigate to My Document QC
    navigateToDocumentQC('petitionsclerk');

    // Click on Create a Case
    getCreateACaseButton().click();
  });

  it('should display parties tab when user navigates to create a case', () => {
    // Expect parties tab to be selected
    const partiesTabElement = getPartiesTab();
    partiesTabElement.should('have.attr', 'aria-selected');

    // Enter the field data and upload/scan all included documents
    fillInCreateCaseFromPaperForm();

    // Click on Review Case button
    getReviewCaseButton().click();
  });

  xit('should display a create case header', () => {
    // Verify Review screen displays
    // Verify that the blue header says Create Case
  });

  xit('should display a tile for party information, case information, irs notice, and attachments', () => {
    // Verify 4 tiles display (Parties, Case Information, IRS Notice, and Attachments)
  });

  xit('should include an edit link for each tile', () => {
    // Verify that each tile has an edit link
  });

  xit('should display serve to irs button', () => {
    // Verify Serve to IRS button appears below the tiles
  });
});
