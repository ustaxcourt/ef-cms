const {
  getButton,
  getCaptionTextArea,
  getCaseDetailTab,
  getCaseTitleContaining,
  getEditCaseCaptionButton,
  navigateTo: navigateToCaseDetail,
} = require('../support/pages/case-detail');

describe('Edit a case caption from case detail header', function () {
  before(() => {
    navigateToCaseDetail('docketclerk', '101-19');
    getCaseDetailTab('case-information').click();
    getEditCaseCaptionButton().click();
    getCaptionTextArea().clear().type('there is no cow level');
    getButton('Save').click();
  });

  it('should changes the title of the case', () => {
    getCaseTitleContaining(
      'there is no cow level v. Commissioner of Internal Revenue, Respondent',
    ).should('exist');
  });
});
