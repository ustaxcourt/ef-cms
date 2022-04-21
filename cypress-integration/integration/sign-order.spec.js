const {
  createOrder,
  hoverOverSignatureWarning,
  navigateTo: navigateToCaseDetail,
} = require('../support/pages/case-detail');

describe('Sign order', function () {
  before(() => {
    navigateToCaseDetail('docketclerk', '101-19');
  });

  it('create an order on the case', () => {
    createOrder('101-19');
  });

  it('should display the signature warning banner on hover', () => {
    hoverOverSignatureWarning().should('have.css', 'color', 'rgb(0, 0, 0)');
  });
});
