const {
  docketRecordTable,
  navigateTo: navigateToDashboard,
  searchForCaseByDocketNumber,
} = require('../../support/pages/public/advanced-search');

describe('Advanced search', () => {
  it('should display terminal user header when ip is allowlisted', () => {
    // add 'localhost' to the allowlist of ips for pk, sk allowed-terminal-ips
    cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
      navigateToDashboard();
      searchForCaseByDocketNumber('103-20');
      expect(docketRecordTable()).to.exist;
    });
    // on the case search page, verify the header includes 'US Tax Court Terminal'
  });
});
