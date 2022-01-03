const {
  navigateTo: navigateToDashboard,
  publicHeader,
} = require('../../support/pages/public/advanced-search');

describe('Advanced search', () => {
  it('should display terminal user header when ip is on allowlist', () => {
    cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
      navigateToDashboard();
      publicHeader().should('contain', 'US Tax Court Terminal');
    });
  });
});
