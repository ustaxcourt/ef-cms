import { fillPaperFilingForm } from './fill-paper-filing-form';

export function createAndSaveForLaterPaperFiling({
  dateReceived,
  documentType,
}: {
  documentType: string;
  dateReceived: string;
}) {
  fillPaperFilingForm({ dateReceived, documentType });

  cy.get('[data-testid="save-for-later"]').click();
}
