import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { retry } from '../../../../helpers/retry';

describe('Custom Case Report CSV export', () => {
  beforeEach(() => {
    const downloadPath = Cypress.config('downloadsFolder');
    cy.task('ensureFolderExists', downloadPath);
  });

  afterEach(() => {
    const downloadPath = Cypress.config('downloadsFolder');
    cy.task('deleteAllFilesInFolder', downloadPath);
  });

  it('should download the Custom Case Report data in CSV format', () => {
    createAndServePaperPetition({ yearReceived: '1950' }).then(caseRecord => {
      cy.login('docketclerk', '/reports/custom-case');
      cy.get('[data-testid="export-custom-case-report"]').should('be.disabled');
      cy.get('[data-testid="submit-custom-case-report-button"]').click();

      cy.get(
        `[data-testid="custom-case-report-row-${caseRecord.docketNumber}"]`,
      ).should('exist');

      cy.get('[data-testid="export-custom-case-report"]').should('be.enabled');
      cy.get('[data-testid="export-custom-case-report"]').click();

      const downloadPath = Cypress.config('downloadsFolder');

      let reportCount: number = -1;
      cy.get('[data-testid="custom-case-report-count"]')
        .invoke('text')
        .then(innerText => {
          reportCount = +innerText;
        });

      retry(() => waitUntilTheCsvFileIsInTheDownloadFolder(downloadPath));

      cy.listDownloadedFiles(downloadPath).then((files: string[]) => {
        const latestFile = files
          .sort()
          .filter((fileName: string) =>
            fileName.includes('Custom Case Report - '),
          )
          .filter((fileName: string) => fileName.endsWith('.csv'))
          .pop();

        const filePath = `${downloadPath}/${latestFile}`;
        // eslint-disable-next-line promise/no-nesting
        return cy.readFile(filePath, 'utf-8').then(fileContent => {
          cy.wrap(
            fileContent.split('\n').filter((str: string) => !!str).length,
          ).should('equal', reportCount + 1);
        });
      });
    });
  });
});

const waitUntilTheCsvFileIsInTheDownloadFolder = (downloadPath: string) => {
  return cy.listDownloadedFiles(downloadPath).then((files: string[]) => {
    const latestFile = files
      .sort()
      .filter((fileName: string) => fileName.includes('Custom Case Report - '))
      .filter((fileName: string) => fileName.endsWith('.csv'))
      .pop();

    return !!latestFile;
  });
};
