import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { externalUserSearchesDocketNumber } from '../../helpers/external-user-searches-docket-number';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkQcsAndServesElectronicCase } from '../../helpers/petitions-clerk-qcs-and-serves-electronic-case';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

// todo: type correctly
const confirmDownloadOfDocuments = (documentsCreated: {}[]) => {
  cy.get('[data-testid="download-docket-records-button"]').should(
    'be.disabled',
  );
  cy.get('[data-testid="all-selectable-docket-entries-checkbox"]').check();
  cy.get('[data-testid="download-docket-records-button"]').should('be.enabled');
  cy.get('[data-testid="download-docket-records-button"]').click();
  cy.get('[data-testid="download-docket-entries-modal"]').should('be.visible');
  cy.get('[data-testid="documents-download-count-text"]').should(
    'contain.text',
    `You have selected ${documentsCreated.length} docket entries to download as a zip file.`,
  );
};

const includePrintableDocketRecord = () => {
  cy.get(
    '[data-testid="include-printable-docket-record-checkbox-checkbox-label"]',
  ).click();
};

// const verifyDownloadedFiles = (downloadPath: string) => {
//   cy.listDownloadedFiles(downloadPath).then((files: string[]) => {
//     return files.length === 7;
//   });
// };

describe('Batch Download Documents', () => {
  // get from cypress/cypress-integration/integration/custom-case-report-csv-export.cy.ts from 10249 work
  let downloadPath: string;
  beforeEach(() => {
    downloadPath = Cypress.config('downloadsFolder');
    // cy.task('deleteAllFilesInFolder', downloadPath);
  });

  it.only('should download all eligible documents that are not stricken with the printable docket record, with all files in a flat directory', () => {
    createAndServePaperPetition().then(
      ({ docketNumber, documentsCreated, name }) => {
        searchByDocketNumberInHeader(docketNumber);
        confirmDownloadOfDocuments(documentsCreated);
        includePrintableDocketRecord();
        cy.get('[data-testid="modal-button-confirm"]').click();

        cy.task('unzipFile', {
          filePath: `${downloadPath}/${docketNumber}, ${name}.zip`,
          unzipPath: downloadPath,
        }).then(files => {
          console.log('got files!', files);
        });
      },
    );
  });

  it('should download all eligible documents with some stricken and some sealed, labeling files and adding sealed docs to sealed directory', () => {
    createAndServePaperPetition().then(({ docketNumber, documentsCreated }) => {
      loginAsDocketClerk();
      searchByDocketNumberInHeader(docketNumber);

      // strike documents
      cy.get('[data-testid="edit-ATP"]').click();
      cy.get('[data-testid="tab-action"]').click();
      cy.get('[data-testid="strike-entry"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="tab-action"]').click();
      cy.get('[data-testid="strike-entry"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      // seal documents
      cy.get('[data-testid="seal-docket-entry-button-3"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="seal-docket-entry-button-5"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      confirmDownloadOfDocuments(documentsCreated);
      cy.get('[data-testid="modal-button-confirm"]').click();

      // TODO: verify download
    });
  });

  it('should download selected documents, labeling stricken documents and putting everything except the printable docket record into the sealed directory when then the case is sealed', () => {
    createAndServePaperPetition().then(({ docketNumber, documentsCreated }) => {
      loginAsDocketClerk();
      searchByDocketNumberInHeader(docketNumber);

      // strike documents
      cy.get('[data-testid="edit-ATP"]').click();
      cy.get('[data-testid="tab-action"]').click();
      cy.get('[data-testid="strike-entry"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="tab-action"]').click();
      cy.get('[data-testid="strike-entry"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      // seal case
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="seal-case-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="tab-docket-record"] > .button-text').click();

      confirmDownloadOfDocuments(documentsCreated);
      includePrintableDocketRecord();

      // TODO: verify download
    });
  });

  it('should download selected documents filtered by file type', () => {
    createAndServePaperPetition().then(({ docketNumber, documentsCreated }) => {
      loginAsDocketClerk();
      searchByDocketNumberInHeader(docketNumber);
      cy.get('[data-testid="tab-drafts"] > .button-text').click();
      cy.get('[data-testid="docket-entry-description-1"]').click();
      cy.get('#apply-signature').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
      cy.get('.usa-date-picker__button').click();
      cy.get(
        ':nth-child(4) > :nth-child(3) > .usa-date-picker__calendar__date',
      ).click();
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="print-paper-service-done-button"]').click();
      cy.get('#document-filter-by').select('Orders');
      confirmDownloadOfDocuments(documentsCreated);

      // TODO: verify download
    });
  });

  it('should not show download controls for external users', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      petitionsClerkQcsAndServesElectronicCase(docketNumber);
      loginAsPetitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="download-docket-records-button"]').should(
        'not.be.visible',
      );
      cy.get('[data-testid="all-selectable-docket-entries-checkbox"]').should(
        'not.be.visible',
      );
    });
  });
});
