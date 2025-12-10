import { fillPaperFilingForm } from './fill-paper-filing-form';

export function createAndServePaperFiling({
  dateReceived,
  documentType,
  purpose,
  isPaperCase = true,
}: {
  documentType: string;
  dateReceived: string;
  isPaperCase?: boolean;
  purpose?: string;
}) {
  fillPaperFilingForm({ dateReceived, documentType });

  if (documentType.includes('Motion') && purpose) {
    cy.log('Filling in document description for motion type document');
    cy.get('#free-text').clear();
    cy.get('#free-text').type(purpose);
  }

  cy.intercept('GET', '**/documents/**/upload-policy').as('uploadPolicy');

  cy.get('[data-testid="save-and-serve"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();

  if (isPaperCase)
    cy.get('[data-testid="print-paper-service-done-button"]').click();

  return cy.wait('@uploadPolicy').then(({ request }) => {
    const regex = /(?<=documents\/).*(?=\/upload-policy)/;
    const docketEntryId = regex.exec(request.url)?.join()!;
    return cy.wrap({ docketEntryId });
  });
}
