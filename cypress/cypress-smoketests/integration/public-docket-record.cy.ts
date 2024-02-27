import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';

describe('Public Docket Record', () => {
  it('should allow the user to generate and download a PDF of the docket record', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.visit('/');
      cy.get('input#docket-number').type(docketNumber);
      cy.get('button#docket-search-button').click();
      cy.get('[data-testid="header-public-case-detail"]').contains(
        `Docket Number: ${docketNumber}`,
      );
      cy.get('[data-testid="print-public-docket-record-button"]').click();
      cy.get('[data-testid="modal-header"]');
    });
  });
});
