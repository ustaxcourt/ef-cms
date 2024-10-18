import { createAndServePaperPetition } from '../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from '../../../helpers/caseDetail/go-to-case';

if (!Cypress.env('SMOKETESTS_LOCAL')) {
  describe('AWS Batch - Docket Entries Download', () => {
    before(() => {
      cy.task('getRawFeatureFlagValue', {
        flag: 'aws-batch-zipper-minimum-count',
      }).as('ORIGINAL_FEATUE_FLAG_VALUE');

      cy.task('toggleFeatureFlag', {
        flag: 'aws-batch-zipper-minimum-count',
        flagValue: 1,
      });
    });

    after(() => {
      cy.get('@ORIGINAL_FEATUE_FLAG_VALUE').then(ORIGINAL_FEATUE_FLAG_VALUE => {
        cy.task('toggleFeatureFlag', {
          flag: 'aws-batch-zipper-minimum-count',
          flagValue: ORIGINAL_FEATUE_FLAG_VALUE,
        });
      });
    });

    beforeEach(() => {
      const downloadPath = Cypress.config('downloadsFolder');
      cy.task('ensureFolderExists', downloadPath);

      createAndServePaperPetition().then(({ docketNumber, name }) => {
        cy.wrap(docketNumber).as('DOCKET_NUMBER');

        const zipName = `${docketNumber}, ${name}.zip`;
        cy.wrap(zipName).as('ZIP_NAME');
      });

      cy.keepAliases();
    });

    it('should download docket entries using AWS BATCH', () => {
      cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
        console.log('docketNumber', docketNumber);
        goToCase(docketNumber);
        cy.get('[data-testid="download-docket-records-button"]').should(
          'be.disabled',
        );
        cy.get(
          '[data-testid="all-selectable-docket-entries-checkbox"]',
        ).click();
        cy.get('[data-testid="download-docket-records-button"]').should(
          'not.be.disabled',
        );
        cy.get('[data-testid="download-docket-records-button"]').click();
        cy.get('[data-testid="download-docket-entries-modal"]').should(
          'be.visible',
        );
        cy.get('[data-testid="modal-button-confirm"]').click();

        cy.get('[data-testid="progress-bar-description"]').should(
          'contain.text',
          'Preparing Files',
        );

        cy.wait(40 * 1000);

        cy.get('[data-testid="progress-bar-description"]').should(
          'contain.text',
          'Compressing Files',
        );

        cy.get('@ZIP_NAME').then(ZIP_NAME => {
          function checkFileExists(attempt: number = 0) {
            const maxRetries = 5;
            cy.task('doesFileExists', ZIP_NAME).then(fileExists => {
              if (fileExists) {
                cy.task<string[]>('unzipFile', {
                  fileName: ZIP_NAME,
                }).then(files => {
                  const countOfDownloadedFiles = files.length;
                  expect(countOfDownloadedFiles).to.equal(6);
                });
              } else if (attempt < maxRetries) {
                const ONE_SECOND = 1 * 1000;
                cy.wait(ONE_SECOND);
                checkFileExists(attempt + 1);
              } else {
                throw new Error(
                  `File ${ZIP_NAME} not found after ${maxRetries} retries.`,
                );
              }
            });
          }

          checkFileExists();
        });
      });
    });
  });
} else {
  describe('AWS Batch - Docket Entries Download', () => {
    it('should not run this test because this only covers behavior around a deployed environment', () => {
      expect(true).to.equal(true);
    });
  });
}
