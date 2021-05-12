const {
  getActionMenuButton,
  getActionMenuSubMenuButton,
  getApplySignatureButton,
  getButton,
  getCaseDetailTab,
  hoverOverSignatureWarning,
  navigateTo: navigateToCaseDetail,
  selectOrderTypeOption,
} = require('../support/pages/case-detail');

describe('Sign order', function () {
  before(() => {
    navigateToCaseDetail('docketclerk', '101-19');
    getActionMenuButton().click();
    getActionMenuSubMenuButton('create-order').click();
    selectOrderTypeOption(1);
    getButton('Continue').click();
    getCaseDetailTab('drafts').click();
    getApplySignatureButton().click();
  });

  it('should display the signature warning banner on hover', () => {
    hoverOverSignatureWarning().should('have.css', 'color', 'rgb(0, 0, 0)');
  });
});
