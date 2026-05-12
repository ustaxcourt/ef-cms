import { createAndServePaperPetition } from '../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import { goToCase } from '../../../helpers/caseDetail/go-to-case';

describe('AWS Batch - Docket Entries Download', () => {
  before(function () {
    if (getCypressEnv().isLocal) {
      this.skip();
    }
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
      cy.get('[data-testid="all-selectable-docket-entries-checkbox"]').click();
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

      cy.get('[data-testid="progress-bar-description"]', {
        timeout: 180000,
      }).should('contain.text', 'Compressing Files');

      cy.get('@ZIP_NAME').then(ZIP_NAME => {
        // The zip is written to the local downloads folder by the browser
        // out-of-band, so we must poll the filesystem.
        const POLL_INTERVAL_MS = 1000;
        const MAX_ATTEMPTS = 60;

        function checkFileExists(attempt: number = 0) {
          cy.task('fileExists', ZIP_NAME).then(fileExists => {
            if (fileExists) {
              cy.task<string[]>('unzipFile', {
                fileName: ZIP_NAME,
              }).then(files => {
                const countOfDownloadedFiles = files.length;
                expect(countOfDownloadedFiles).to.equal(6);
              });
            } else if (attempt < MAX_ATTEMPTS) {
              // eslint-disable-next-line cypress/no-unnecessary-waiting -- polling the local filesystem for an out-of-band browser download
              cy.wait(POLL_INTERVAL_MS);
              checkFileExists(attempt + 1);
            } else {
              throw new Error(
                `File ${ZIP_NAME} not found after ${MAX_ATTEMPTS} retries.`,
              );
            }
          });
        }

        checkFileExists();
      });
    });
  });
});
