const {
  getActionMenuButton,
  getCaptionTextArea,
  getCaseTitleContaining,
  getEditCaseCaptionButton,
  getSaveButton,
  navigateTo: navigateToCaseDetail,
} = require('../support/pages/case-detail');

describe('Edit a case caption from case detail header', function () {
  before(() => {
    navigateToCaseDetail('docketclerk', '101-19');
    getActionMenuButton().click();
    getEditCaseCaptionButton().click();
    getCaptionTextArea().clear().type('there is no cow level');
    getSaveButton().click();
  });

  it('should changes the title of the case', () => {
    getCaseTitleContaining(
      'there is no cow level v. Commissioner of Internal Revenue, Respondent',
    ).should('exist');
  });
});
