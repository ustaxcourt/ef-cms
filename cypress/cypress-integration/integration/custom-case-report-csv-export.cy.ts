describe('Custom Case Report CSV export', () => {
  it('should download the Custom Case Report data in CSV format', () => {
    cy.login('docketclerk', '/reports/custom-case');
    cy.get('[data-testid="export-pending-report"]').should('be.disabled');
    cy.get('[data-testid="run-custom-case-report"]').click();
    cy.get('[data-testid="export-pending-report"]').should('be.enabled');
    cy.get('[data-testid="export-pending-report"]').click();

    const downloadPath = Cypress.config('downloadsFolder');

    let reportCount: number = -1;
    cy.get('[data-testid="custom-case-report-count"]')
      .invoke('text')
      .then(innerText => {
        reportCount = +innerText;
      });

    cy.listDownloadedFiles(downloadPath).then((files: string[]) => {
      const latestFile = files
        .sort()
        .filter((fileName: string) => fileName.endsWith('.csv'))
        .pop();

      const filePath = `${downloadPath}/${latestFile}`;
      cy.readFile(filePath, 'utf-8').then(fileContent => {
        cy.wrap(fileContent.split('\n').length).should(
          'equal',
          reportCount + 1,
        );
      });
    });
  });
});
