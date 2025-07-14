import { loginAsDocketClerk } from "cypress/helpers/authentication/login-as-helpers";
import { goToCase } from "../../go-to-case";
import { selectTypeaheadInput } from "cypress/helpers/components/typeAhead/select-typeahead-input";
import { attachFile } from "cypress/helpers/file/upload-file";

export const createStatusReport = (docketNumber: string) => {
  loginAsDocketClerk();
  goToCase(docketNumber);
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-add-paper-filing"]').click();
  cy.get('.usa-date-picker__wrapper > [data-testid="date-received-picker"]').type('07/08/2025');
  selectTypeaheadInput('primary-document-type-search', 'Status Report');
  cy.get('[data-testid="filed-by-option"').first().click();
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#primaryDocumentFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });
  cy.get('[data-testid="save-and-serve"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
  cy.get('[data-testid="print-paper-service-done-button"]').click();
};