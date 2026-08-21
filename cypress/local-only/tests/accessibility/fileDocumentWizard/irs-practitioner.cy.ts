import { attachSamplePdfFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { externalUserSearchesDocketNumber } from '../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';
import { checkA11y } from '../../../support/generalCommands/checkA11y';
import {
  loginAsIrsPractitioner,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';

const openFirstIrsDocumentWizard = (): Cypress.Chainable<string> => {
  loginAsPetitioner();

  return externalUserCreatesElectronicCase(
    'Answer Accessibility Petitioner',
  ).then(docketNumber => {
    petitionsClerkServesPetition(docketNumber);

    loginAsIrsPractitioner();
    externalUserSearchesDocketNumber(docketNumber);
    cy.get('[data-testid="button-first-irs-document"]').click();

    return cy.wrap(docketNumber);
  });
};

describe('File Document Wizard - Irs Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    openFirstIrsDocumentWizard().then(() => {
      cy.get('[data-testid="select-document-to-file-header"]').should('exist');

      checkA11y();
    });
  });

  it('should be free of a11y issues on the Answer upload step', () => {
    openFirstIrsDocumentWizard().then(() => {
      selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
      cy.get('[data-testid="submit-document"]').click();
      cy.get('[data-testid="primary-document-label"]').should('exist');

      checkA11y();
    });
  });

  it('should be free of a11y issues on the Answer review step', () => {
    openFirstIrsDocumentWizard().then(() => {
      selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
      cy.get('[data-testid="submit-document"]').click();
      attachSamplePdfFile('primary-document');
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').should('exist');

      checkA11y();
    });
  });
});
