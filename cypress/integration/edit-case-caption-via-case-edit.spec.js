const {
  getCaseTitleContaining,
  getCaseTitleTextArea,
  getSaveButton,
  navigateTo: navigateToDocumentDetail,
} = require('../support/pages/document-detail');

describe('change the case caption via the case edit page ', () => {
  before(() => {
    cy.seed();
    navigateToDocumentDetail(
      'petitionsclerk',
      '101-19',
      '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
    );
    getCaseTitleTextArea()
      .clear()
      .type('hello world');
    getSaveButton().click();
  });

  it('updates the case title header', () => {
    getCaseTitleContaining(
      'hello world v. Commissioner of Internal Revenue, Respondent',
    ).should('exist');
  });
});
