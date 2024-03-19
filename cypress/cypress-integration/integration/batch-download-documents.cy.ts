import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

const confirmDownloadOfDocuments = (documentsCreated: {}[]) => {
  // type correctly
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

describe('Batch Download Documents', () => {
  // get from cypress/cypress-integration/integration/custom-case-report-csv-export.cy.ts from 10249 work
  // beforeEach(() => {
  //   const downloadPath = Cypress.config('downloadsFolder');
  //   cy.task('deleteAllFilesInFolder', downloadPath);
  // });

  // all cases (not stricken, not sealed)
  it.skip('should download all eligible documents in a case', () => {
    createAndServePaperPetition().then(({ docketNumber, documentsCreated }) => {
      searchByDocketNumberInHeader(docketNumber);
      confirmDownloadOfDocuments(documentsCreated);
      cy.get('#modal-button-confirm').click();

      // how do we confirm download?
    });
  });

  // all cases (not stricken, not sealed) with printable docket record
  it('should download all eligible documents in a case', () => {
    createAndServePaperPetition().then(({ docketNumber, documentsCreated }) => {
      searchByDocketNumberInHeader(docketNumber);
      confirmDownloadOfDocuments(documentsCreated);
      cy.get(
        '[data-testid="include-printable-docket-record-checkbox-checkbox-label"]',
      ).click();
      cy.get('#modal-button-confirm').click();
      // how do we confirm download?
    });
  });
  // all cases (no stricken, sealed)
  // all cases (stricken and sealed)
  // all cases ((stricken and sealed) with printable docket record

  // selected sealed documents
  // selected stricken documents
  // selected sealed and stricken documents

  // electronic case with rqt (will not have a document, worth testing?)
});
