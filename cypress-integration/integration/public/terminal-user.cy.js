const {
  navigateTo: navigateToDashboard,
  petitionHyperlink,
  publicHeader,
  searchForCaseByDocketNumber,
} = require('../../support/pages/public/advanced-search');

describe('Advanced search', () => {
  after(() => {
    cy.task('setAllowedTerminalIpAddresses', []);
  });

  it('should display terminal user header when ip is on allow list', () => {
    cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
      navigateToDashboard();
      publicHeader().should('contain', 'US Tax Court Terminal');

      searchForCaseByDocketNumber('104-20');
      petitionHyperlink().should('exist');
    });
  });
});
