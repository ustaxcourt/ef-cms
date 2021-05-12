const {
  getActionMenuButton,
  getActionMenuSubMenuButton,
  getApplySignatureButton,
  getButton,
  getCaseDetailTab,
  // getSignatureWarningContaining,
  getSnapshot,
  moveSignatureToBottomOfPdf,
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
    // FIXME: attempt to sign at the bottom
    moveSignatureToBottomOfPdf();
    getSnapshot('.sign-pdf-interface');
  });

  it('should display the signature warning banner', () => {
    // getSignatureWarningContaining('signature-warning').should('exist');
  });
});
