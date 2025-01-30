describe('Amended And Redacted Brief Visibility', () => {
  it('Unauthorized Public User', () => {
    const expectedDocketRecordVisibility = {
      1: { eventCode: 'P', showLinkToDocument: false },
      2: { eventCode: 'RQT', showLinkToDocument: false },
      3: { eventCode: 'NOTR', showLinkToDocument: false },
      4: { eventCode: 'AMAT', showLinkToDocument: false },
      5: { eventCode: 'SIAB', showLinkToDocument: true },
      6: { eventCode: 'SIAM', showLinkToDocument: true },
      7: { eventCode: 'SIOB', showLinkToDocument: false },
      8: { eventCode: 'AMAT', showLinkToDocument: true },
      9: { eventCode: 'AMAT', showLinkToDocument: false },
      10: { eventCode: 'REDC', showLinkToDocument: true },
      11: { eventCode: 'MISCL', showLinkToDocument: false },
      12: { eventCode: 'SEAB', showLinkToDocument: true },
      13: { eventCode: 'SESB', showLinkToDocument: false },
      14: { eventCode: 'REDC', showLinkToDocument: true },
      15: { eventCode: 'NODC', showLinkToDocument: false },
      16: { eventCode: 'SIAB', showLinkToDocument: false },
      17: { eventCode: 'AMAT', showLinkToDocument: true },
      18: { eventCode: 'AMAT', showLinkToDocument: true },
      19: { eventCode: 'REDC', showLinkToDocument: false },
      20: { eventCode: 'SEOB', showLinkToDocument: true },
      21: { eventCode: 'AMAT', showLinkToDocument: true },
      22: { eventCode: 'AMBR', showLinkToDocument: false },
      23: { eventCode: 'AMBR', showLinkToDocument: true },
      24: { eventCode: 'AMAT', showLinkToDocument: true },
      25: { eventCode: 'AMAT', showLinkToDocument: true },
      26: { eventCode: 'SIMB', showLinkToDocument: false },
      27: { eventCode: 'M014', showLinkToDocument: false },
      28: { eventCode: 'MISCL', showLinkToDocument: false },
      29: { eventCode: 'AMAT', showLinkToDocument: false },
      30: { eventCode: 'REPL', showLinkToDocument: false },
    };

    cy.visit('/');
    cy.get('[data-testid="docket-number"]').type('105-23');
    cy.get('[data-testid="docket-search-button"]').click();
    cy.get('[data-testid="header-public-case-detail"]');

    Object.entries(expectedDocketRecordVisibility).forEach(
      ([docketOrder, documentExpectation]) => {
        if (documentExpectation.showLinkToDocument) {
          cy.get(`[data-testid=public-docket-record-no-${docketOrder}]`).find(
            '[data-testid=Filing-and-Proceedings-link-to-docket-entry]',
          );
        } else {
          cy.get(`[data-testid=public-docket-record-no-${docketOrder}]`)
            .find('[data-testid=Filing-and-Proceedings-link-to-docket-entry]')
            .should('not.exist');
        }
      },
    );
  });

  it('Terminal User', () => {
    const expectedDocketRecordVisibility = {
      1: { eventCode: 'P', showLinkToDocument: true },
      2: { eventCode: 'RQT', showLinkToDocument: false },
      3: { eventCode: 'NOTR', showLinkToDocument: true },
      4: { eventCode: 'AMAT', showLinkToDocument: true },
      5: { eventCode: 'SIAB', showLinkToDocument: true },
      6: { eventCode: 'SIAM', showLinkToDocument: true },
      7: { eventCode: 'SIOB', showLinkToDocument: false },
      8: { eventCode: 'AMAT', showLinkToDocument: true },
      9: { eventCode: 'AMAT', showLinkToDocument: false },
      10: { eventCode: 'REDC', showLinkToDocument: true },
      11: { eventCode: 'MISCL', showLinkToDocument: true },
      12: { eventCode: 'SEAB', showLinkToDocument: true },
      13: { eventCode: 'SESB', showLinkToDocument: false },
      14: { eventCode: 'REDC', showLinkToDocument: true },
      15: { eventCode: 'NODC', showLinkToDocument: true },
      16: { eventCode: 'SIAB', showLinkToDocument: false },
      17: { eventCode: 'AMAT', showLinkToDocument: true },
      18: { eventCode: 'AMAT', showLinkToDocument: true },
      19: { eventCode: 'REDC', showLinkToDocument: false },
      20: { eventCode: 'SEOB', showLinkToDocument: true },
      21: { eventCode: 'AMAT', showLinkToDocument: true },
      22: { eventCode: 'AMBR', showLinkToDocument: true },
      23: { eventCode: 'AMBR', showLinkToDocument: true },
      24: { eventCode: 'AMAT', showLinkToDocument: true },
      25: { eventCode: 'AMAT', showLinkToDocument: true },
      26: { eventCode: 'SIMB', showLinkToDocument: false },
      27: { eventCode: 'M014', showLinkToDocument: true },
      28: { eventCode: 'MISCL', showLinkToDocument: true },
      29: { eventCode: 'AMAT', showLinkToDocument: true },
      30: { eventCode: 'REPL', showLinkToDocument: true },
    };
    cy.task('setAllowedTerminalIpAddresses', ['localhost']);

    cy.visit('/');
    cy.get('[data-testid="docket-number"]').type('105-23');
    cy.get('[data-testid="docket-search-button"]').click();
    cy.get('[data-testid="header-public-case-detail"]');

    Object.entries(expectedDocketRecordVisibility).forEach(
      ([docketOrder, documentExpectation]) => {
        if (documentExpectation.showLinkToDocument) {
          cy.get(`[data-testid=public-docket-record-no-${docketOrder}]`).find(
            '[data-testid=Filing-and-Proceedings-link-to-docket-entry]',
          );
        } else {
          cy.get(`[data-testid=public-docket-record-no-${docketOrder}]`)
            .find('[data-testid=Filing-and-Proceedings-link-to-docket-entry]')
            .should('not.exist');
        }
      },
    );

    cy.task('setAllowedTerminalIpAddresses', []);
  });
});
