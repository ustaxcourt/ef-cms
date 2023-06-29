import {
  getButton,
  getCaptionTextArea,
  getCaseDetailTab,
  getCaseTitleContaining,
  getEditCaseCaptionButton,
  navigateTo as navigateToCaseDetail,
} from '../support/pages/case-detail';

describe('Edit a case caption from case detail header', function () {
  it('should changes the title of the case', () => {
    navigateToCaseDetail('docketclerk', '101-19');
    getCaseDetailTab('case-information').click();
    getEditCaseCaptionButton().click();
    getCaptionTextArea().clear().type('there is no cow level');
    getButton('Save').click();

    getCaseTitleContaining(
      'there is no cow level v. Commissioner of Internal Revenue, Respondent',
    ).should('exist');
  });
});
