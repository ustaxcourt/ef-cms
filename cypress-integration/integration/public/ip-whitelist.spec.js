it('should display terminal user header when ip is allowlisted', () => {
  // add 'localhost' to the allowlist of ips for pk, sk allowed-terminal-ips
  cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
    navigateToDashboard();
    searchForCaseByDocketNumber('104-20');
    const docketRecord = docketRecordTable();
    docketRecord.should('exist');
    const petitionRow = docketRecord
      .get('tr')
      .contains('Petition', { matchCase: false });
    petitionRow.should('exist');
    petitionRow.find('button').should('not.exist');
  });
  // on the case search page, verify the header includes 'US Tax Court Terminal'
});
