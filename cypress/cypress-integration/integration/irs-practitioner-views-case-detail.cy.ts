import {
  getCaseDetailTab,
  navigateTo as navigateToCaseDetail,
} from '../support/pages/case-detail';

describe('IRS Practitioner views case detail', () => {
  it('should NOT display filing fee information', () => {
    navigateToCaseDetail('irspractitioner', '101-19');
    getCaseDetailTab('case-information').click();
    cy.get('[data-testid="filling-fee-message"]').should('not.exist');
  });
});
