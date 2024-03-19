import { selectTypeaheadInput } from './select-typeahead-input';

export function createAndServePaperFiling(
  documentType: string,
  dateReceived: string,
) {
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-add-paper-filing"]').click();
  cy.get(
    '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
  ).type(dateReceived);
  selectTypeaheadInput('document-type', documentType);
  cy.get('[data-testid="filed-by-option"]').click();
  cy.get('[data-testid="objections-No"]').click();
  cy.get('[data-testid="upload-pdf-button"]').click();

  cy.get('input#primaryDocumentFile-file').attachFile(
    '../fixtures/w3-dummy.pdf',
  );

  cy.get('[data-testid="save-and-serve"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('[data-testid="print-paper-service-done-button"]').click();
}
