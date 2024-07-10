import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';

describe('Custom Case Report CSV export', () => {
  beforeEach(() => {
    cy.task('deleteAllFilesInFolder', 'cypress/downloads');
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

      let reportCount: number = -1;
      cy.get('[data-testid="custom-case-report-count"]')
        .invoke('text')
        .then(innerText => {
          reportCount = +innerText;
        });

      const today = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
      const expectedFileName = `Custom Case Report - ${today}.csv`;
      return cy
        .readFile(`cypress/downloads/${expectedFileName}`, 'utf-8')
        .then(fileContent => {
          const totalCasesInReport = fileContent
            .split('\n')
            .filter((str: string) => !!str).length;
          expect(totalCasesInReport).to.equal(reportCount + 1);
        });
    });
  });
});
