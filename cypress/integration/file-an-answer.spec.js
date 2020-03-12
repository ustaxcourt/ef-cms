const {
  navigateTo: navigateToDashboard,
} = require('../support/pages/dashboard');

describe('Filing an Answer', function() {
  before(() => {
    cy.task('seed');
    cy.login('irsPractitioner', '/case-detail/102-19');
  });

  it('should have a file first IRS document button', () => {
    cy.get('#button-first-irs-document').click();
  });

  it('can select a document type and go to the next step in the wizard', () => {
    cy.get('#react-select-2-input').click();
    cy.get('#react-select-2-option-6').click();
    cy.get('button#submit-document').click();
  });

  it('can upload the answer with indication of success', () => {
    cy.get('label#primary-document-label')
      .scrollIntoView()
      .should('not.have.class', 'validated');

    cy.upload_file('w3-dummy.pdf', '#primary-document');

    cy.get('label#primary-document-label').should('have.class', 'validated');
  });

  it('can select a party and go to the review page', () => {
    cy.get('label[for="party-irs-practitioner"]').click();
    cy.get('button#submit-document').click();
  });

  it('can submit the filing from the review page', () => {
    cy.get('button#submit-document').click();
    cy.showsSuccessMessage(true);
  });

  it('docket record table reflects newly-added record', () => {
    cy.get('table.docket-record')
      .find('a')
      .should('contain', 'Answer');
  });

  it('reflects changes to 102-19 by showing it in irsPractitioner case list', () => {
    navigateToDashboard('irsPractitioner');
    cy.get('table#case-list')
      .find('a')
      .should('contain', '102-19');
  });
});
