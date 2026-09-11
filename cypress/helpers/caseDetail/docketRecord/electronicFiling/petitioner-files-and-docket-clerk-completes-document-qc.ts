import { attachFile } from '../../../file/upload-file';
import { externalUserSearchesDocketNumber } from '../../../advancedSearch/external-user-searches-docket-number';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../components/typeAhead/select-typeahead-input';

export function petitionerFilesAndDocketClerkCompletesDocumentQc({
  docketNumber,
  documentType,
  primaryFilerName,
}: {
  docketNumber: string;
  documentType: string;
  primaryFilerName: string;
}): void {
  loginAsPetitioner();
  externalUserSearchesDocketNumber(docketNumber);
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();
  selectTypeaheadInput('complete-doc-document-type-search', documentType);
  cy.get('[data-testid="submit-document"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '[data-testid="primary-document"]',
    selectorToAwaitOnSuccess:
      '[data-testid="upload-file-success-primary-document"]',
  });
  cy.get(`[data-testid="filingParty-${primaryFilerName}, Petitioner"]`).click();
  cy.get('[data-testid="primaryDocument-objections-No"]').click();
  cy.get('[data-testid="file-document-submit-document"]').click();
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="file-document-review-submit-document"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');

  loginAsDocketClerk1();
  cy.get('[data-testid="document-qc-nav-item"]').click();
  cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
  cy.get(`[data-testid=work-item-${docketNumber}]`)
    .find(`[data-testid=work-item-document-link-${docketNumber}]`)
    .click();
  cy.get('[data-testid="save-and-finish-document-qc"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');
}
