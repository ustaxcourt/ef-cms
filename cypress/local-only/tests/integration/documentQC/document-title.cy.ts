import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';
import { viewMyOutbox } from 'cypress/local-only/support/pages/dashboard';

describe('Document title updates correctly', () => {
  it('should see the document title was updated when they change the event code while QC-ing', () => {
    const primaryFilerName = 'John';
    const additionalInfo = 'This is additional info';
    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      // Private practitioner adds an exhibit, maybe should have helper to file a document if not already      loginAsPrivatePractitioner();
      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput('complete-doc-document-type-search', 'Exhibit(s)');
      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-primary-document"]',
      });
      cy.get(
        `[data-testid="filingParty-${primaryFilerName}, Petitioner"]`,
      ).click();
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Docket clerk QCs Exhibits docket entry and adds additionalInfo
      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();

      // Get the row for 115-25 that has the exhibit and complete the qc, sending a message
      cy.contains('a', 'Exhibit(s)').last().click();
      cy.get('[data-testid="additional-info-primary-document-form"]').type(
        additionalInfo,
      );
      cy.get('[data-testid="add-to-coversheet-primary-document-form"]').click({
        force: true,
      });
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      viewMyOutbox();
      cy.contains(`Exhibit(s) ${additionalInfo}`).should('exist');

      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Amendment [anything]',
      );
      cy.get('[data-testid="previous-document-search"]').select('Exhibit(s)');
      cy.get('[data-testid="ordinal-field-select-search"]').select('15');

      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-primary-document"]',
      });
      cy.get(
        `[data-testid="filingParty-${primaryFilerName}, Petitioner"]`,
      ).click({ force: true });
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();

      // Get the row for 115-25 that has the amendment and complete the qc, sending a message
      cy.contains('a', 'Amendment').last().click();
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      viewMyOutbox();
      cy.contains(`Fifteenth Amendment to Exhibit(s) ${additionalInfo}`).should(
        'exist',
      );
    });
  });
});
