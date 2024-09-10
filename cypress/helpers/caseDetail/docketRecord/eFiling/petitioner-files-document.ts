import { navigateToCase } from '../../../../local-only/support/pages/petition-qc';
import { selectTypeaheadInput } from '../../../components/typeAhead/select-typeahead-input';

export const petitionerFilesDocument = (
  docketNumber: string,
  documentType: string,
): Cypress.Chainable<string | undefined> => {
  navigateToCase('petitioner1', docketNumber);
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();
  selectTypeaheadInput('document-type', documentType);
  cy.get('[data-testid="submit-document"]').click();
  cy.get('[data-testid="primary-document"]').attachFile(
    '../../helpers/file/sample.pdf',
  );
  cy.get('[data-testid="upload-file-success"]').should('exist');
  cy.get('[data-testid=primaryDocument-objections-No]').click();
  cy.get('[data-testid="file-document-submit-document"]').click();
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="file-document-review-submit-document"]').click();
  cy.get('[data-testid="success-alert"]').should('exist');
  return cy
    .get('[data-testid="docket-record-table"]')
    .find('tbody > tr')
    .last()
    .invoke('attr', 'data-testid')
    .then(docketEntryId => {
      return cy.wrap(docketEntryId);
    });
};
