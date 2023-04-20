import {
  getCaseInfoTab,
  getCaseTitleContaining,
  getCaseTitleTextArea,
  getHasIrsNoticeYesRadioButton,
  getIrsNoticeTab,
  getReviewPetitionButton,
  getSaveForLaterButton,
  navigateToCase,
  navigateTo as navigateToPetitionQc,
} from '../support/pages/petition-qc';

describe('change the case caption via the petition qc page', () => {
  it('updates the case title header', () => {
    navigateToPetitionQc('petitionsclerk', '102-20');
    getCaseInfoTab().click();
    getCaseTitleTextArea().clear().type('hello world');
    getIrsNoticeTab().click();
    getHasIrsNoticeYesRadioButton().click();
    getReviewPetitionButton().click();
    getSaveForLaterButton().click();
    navigateToCase('petitionsclerk', '102-20');
    getCaseTitleContaining(
      'hello world v. Commissioner of Internal Revenue, Respondent',
    ).should('exist');
  });
});
