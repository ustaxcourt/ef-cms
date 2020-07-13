const {
  getCaseInfoTab,
  getCaseTitleContaining,
  getCaseTitleTextArea,
  getReviewPetitionButton,
  getSaveForLaterButton,
  navigateTo: navigateToPetitionQc,
  navigateToCase,
} = require('../support/pages/petition-qc');

describe('change the case caption via the petition qc page', () => {
  before(() => {
    navigateToPetitionQc(
      'petitionsclerk',
      '101-19',
      '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
    );
    getCaseInfoTab().click();
    getCaseTitleTextArea().clear().type('hello world');
    getReviewPetitionButton().click();
    getSaveForLaterButton().click();
  });

  it('updates the case title header', () => {
    navigateToCase('petitionsclerk', '101-19');
    getCaseTitleContaining(
      'hello world v. Commissioner of Internal Revenue, Respondent',
    ).should('exist');
  });
});
