import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { createISODateString } from '../../../shared/src/business/utilities/DateHandler';
import { externalUserSearchesDocketNumber } from '../../helpers/external-user-searches-docket-number';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkQcsAndServesElectronicCase } from '../../helpers/petitions-clerk-qcs-and-serves-electronic-case';
import { retry } from '../../helpers/retry';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

// todo: type correctly
const confirmDownloadOfDocuments = (documentsCreated: {}[]) => {
  const docketEntriesText = `${documentsCreated.length} ${documentsCreated.length === 1 ? 'docket entry' : 'docket entries'}`;
  cy.get('[data-testid="download-docket-records-button"]').should(
    'be.disabled',
  );
  cy.get('[data-testid="all-selectable-docket-entries-checkbox"]').check();
  cy.get('[data-testid="download-docket-records-button"]').should('be.enabled');
  cy.get('[data-testid="download-docket-records-button"]').click();
  cy.get('[data-testid="download-docket-entries-modal"]').should('be.visible');
  cy.get('[data-testid="documents-download-count-text"]').should(
    'contain.text',
    `You have selected ${docketEntriesText} to download as a zip file.`,
  );
};

const includePrintableDocketRecord = () => {
  cy.get(
    '[data-testid="include-printable-docket-record-checkbox-checkbox-label"]',
  ).click();
};

const verifyDownloadedFiles = ({
  downloadPath,
  zipName,
}: {
  downloadPath: string;
  zipName: string;
}) => {
  return cy.listDownloadedFiles(downloadPath).then((files: string[]) => {
    return files.includes(zipName);
  });
};

const checkFileCounts = ({
  expectedFileCount,
  expectedSealedCount,
  expectedStrickenCount,
  files,
}: {
  expectedFileCount: number;
  expectedSealedCount: number;
  expectedStrickenCount: number;
  files: string[];
}) => {
  const countOfDownloadedFiles = files.length;
  expect(countOfDownloadedFiles).to.equal(expectedFileCount);

  const sealedFilesFound = files.filter((fileName: string) =>
    fileName.includes('sealed'),
  );
  const strickenFilesFound = files.filter((fileName: string) =>
    fileName.includes('STRICKEN_'),
  );

  expect(strickenFilesFound.length).to.equal(expectedStrickenCount);
  expect(sealedFilesFound.length).to.equal(expectedSealedCount);
};

describe('Batch Download Documents', () => {
  let downloadPath: string;
  beforeEach(() => {
    downloadPath = Cypress.config('downloadsFolder');
    // cy.task('deleteAllFilesInFolder', downloadPath); TODO: make this work
  });

  it('should download all eligible documents that are not stricken with the printable docket record, with all files in a flat directory', () => {
    createAndServePaperPetition().then(
      ({ docketNumber, documentsCreated, name }) => {
        const zipName = `${docketNumber}, ${name}.zip`;
        let expectedFileCount = documentsCreated.length;
        const expectedSealedCount = 0;
        const expectedStrickenCount = 0;
        searchByDocketNumberInHeader(docketNumber);
        confirmDownloadOfDocuments(documentsCreated);
        includePrintableDocketRecord();
        expectedFileCount++;
        cy.get('[data-testid="modal-button-confirm"]').click();

        retry(() => verifyDownloadedFiles({ downloadPath, zipName }));

        cy.task('unzipFile', {
          destinationPath: downloadPath,
          filePath: `${downloadPath}/${zipName}`,
        }).then((files: string[]) => {
          checkFileCounts({
            expectedFileCount,
            expectedSealedCount,
            expectedStrickenCount,
            files,
          });
        });
      },
    );
  });

  it('should download all eligible documents with some stricken and some sealed, labeling files and adding sealed docs to sealed directory', () => {
    createAndServePaperPetition().then(
      ({ docketNumber, documentsCreated, name }) => {
        const zipName = `${docketNumber}, ${name}.zip`;
        let expectedFileCount = documentsCreated.length;
        let expectedSealedCount = 0;
        let expectedStrickenCount = 0;
        loginAsDocketClerk();
        searchByDocketNumberInHeader(docketNumber);

        // strike documents
        cy.get('[data-testid="edit-ATP"]').click();
        cy.get('[data-testid="tab-action"]').click();
        cy.get('[data-testid="strike-entry"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        expectedStrickenCount++;

        cy.get('[data-testid="edit-APW"]').click();
        cy.get('[data-testid="tab-action"]').click();
        cy.get('[data-testid="strike-entry"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        expectedStrickenCount++;

        // seal documents
        cy.get('[data-testid="seal-docket-entry-button-3"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        expectedSealedCount++;

        cy.get('[data-testid="seal-docket-entry-button-5"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        expectedSealedCount++;

        confirmDownloadOfDocuments(documentsCreated);
        cy.get('[data-testid="modal-button-confirm"]').click();

        retry(() => verifyDownloadedFiles({ downloadPath, zipName }));

        cy.task('unzipFile', {
          destinationPath: downloadPath,
          filePath: `${downloadPath}/${zipName}`,
        }).then((files: string[]) => {
          checkFileCounts({
            expectedFileCount,
            expectedSealedCount,
            expectedStrickenCount,
            files,
          });
        });
      },
    );
  });

  it('should download selected documents, labeling stricken documents and putting everything except the printable docket record into the sealed directory when then the case is sealed', () => {
    createAndServePaperPetition().then(
      ({ docketNumber, documentsCreated, name }) => {
        const zipName = `${docketNumber}, ${name}.zip`;
        let expectedFileCount = documentsCreated.length;
        let expectedSealedCount = 0;
        let expectedStrickenCount = 0;
        loginAsDocketClerk();
        searchByDocketNumberInHeader(docketNumber);

        // strike documents
        cy.get('[data-testid="edit-ATP"]').click();
        cy.get('[data-testid="tab-action"]').click();
        cy.get('[data-testid="strike-entry"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        expectedStrickenCount++;

        cy.get('[data-testid="edit-APW"]').click();
        cy.get('[data-testid="tab-action"]').click();
        cy.get('[data-testid="strike-entry"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        expectedStrickenCount++;

        // seal entire case
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="seal-case-button"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="tab-docket-record"] > .button-text').click();
        expectedSealedCount = documentsCreated.length;

        confirmDownloadOfDocuments(documentsCreated);
        includePrintableDocketRecord();
        expectedFileCount++;
        cy.get('[data-testid="modal-button-confirm"]').click();

        retry(() => verifyDownloadedFiles({ downloadPath, zipName }));

        cy.task('unzipFile', {
          destinationPath: downloadPath,
          filePath: `${downloadPath}/${zipName}`,
        }).then((files: string[]) => {
          checkFileCounts({
            expectedFileCount,
            expectedSealedCount,
            expectedStrickenCount,
            files,
          });
        });
      },
    );
  });

  it('should download selected documents filtered by file type', () => {
    createAndServePaperPetition().then(({ docketNumber, name }) => {
      const zipName = `${docketNumber}, ${name}.zip`;
      //TODO: this can either be magic or we can filter the documentsCreated here based on their event code
      let expectedFileCount = 1;
      let expectedSealedCount = 0;
      let expectedStrickenCount = 0;
      const today = createISODateString();
      loginAsDocketClerk();
      searchByDocketNumberInHeader(docketNumber);
      cy.get('[data-testid="tab-drafts"] > .button-text').click();
      cy.get('[data-testid="docket-entry-description-1"]').click();
      cy.get('#apply-signature').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
      cy.get('.usa-date-picker__wrapper > [data-testid="date-picker"]').type(
        today,
      );
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="print-paper-service-done-button"]').click();
      cy.get('#document-filter-by').select('Orders');
      confirmDownloadOfDocuments(['']); //TODO: this is kinda magic

      cy.get('[data-testid="modal-button-confirm"]').click();

      retry(() => verifyDownloadedFiles({ downloadPath, zipName }));

      cy.task('unzipFile', {
        destinationPath: downloadPath,
        filePath: `${downloadPath}/${zipName}`,
      }).then((files: string[]) => {
        checkFileCounts({
          expectedFileCount,
          expectedSealedCount,
          expectedStrickenCount,
          files,
        });
      });
    });
  });

  it('should not show download controls for external users', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      petitionsClerkQcsAndServesElectronicCase(docketNumber);
      loginAsPetitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="download-docket-records-button"]').should(
        'not.exist',
      );
      cy.get('[data-testid="all-selectable-docket-entries-checkbox"]').should(
        'not.exist',
      );
    });
  });
});
