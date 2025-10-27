import { fillPaperFilingForm } from './fill-paper-filing-form';

export function createAndServePaperFiling({
  dateReceived,
  documentType,
  purpose = 'Motion to Dismiss',
  isPaperCase = true,
}: {
  documentType: string;
  dateReceived: string;
  isPaperCase?: boolean;
  purpose?: string;
}) {
  
  fillPaperFilingForm({ dateReceived, documentType });

  if (documentType.includes('Motion')) {
    cy.log('Filling in document description for motion type document');
    cy.get('#free-text').clear().type(purpose); // NOTE (#8546): May want to make this a data-testid
  }

  cy.get('[data-testid="save-and-serve"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();

  if (isPaperCase)
    cy.get('[data-testid="print-paper-service-done-button"]').click();
}
