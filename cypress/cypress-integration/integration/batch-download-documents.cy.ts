import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

describe('Batch Download Documents', () => {
  // beforeEach(() => {
  //   const downloadPath = Cypress.config('downloadsFolder');
  //   cy.task('deleteAllFilesInFolder', downloadPath);
  // });

  it('should download all eligible documents in a case', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      searchByDocketNumberInHeader(docketNumber);
      cy.get('[data-testid="download-docket-records-button"]').should(
        'be.disabled',
      );
      cy.get('[data-testid="all-selectable-docket-entries-checkbox"]').check();
      cy.get('[data-testid="download-docket-records-button"]').should(
        'be.enabled',
      );
    });
  });
});
