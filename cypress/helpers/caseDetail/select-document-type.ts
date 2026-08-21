import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';

export const selectDocumentType = (
  docketNumber: string,
  documentType: string,
) => {
  goToCase(docketNumber);
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();
  selectTypeaheadInput('complete-doc-document-type-search', documentType);
  cy.get('[data-testid="submit-document"]').click();
};
