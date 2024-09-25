import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import {
  loginAsIrsPractitioner1,
  loginAsPetitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';
import { uploadFile } from '../../../../../../helpers/file/upload-file';

describe('IRS Practitioner files Entry of Appearance as First IRS Document', () => {
  describe('Auto Generate Entry of Appearance', () => {
    it('should allow auto-generation and subsequent filing of the Entry of Appearance', () => {
      const primaryFilerName = 'John';

      loginAsPetitioner();
      petitionerCreatesElectronicCase(primaryFilerName).then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);

        loginAsIrsPractitioner1();
        externalUserSearchesDocketNumber(docketNumber);

        cy.get('[data-testid="button-first-irs-document"]').click();

        selectTypeaheadInput(
          'complete-doc-document-type-search',
          'Entry of Appearance',
        );
        cy.get('[data-testid="submit-document"]').click();

        cy.get('[data-testid="auto-generation"]').should('exist');
        cy.get('[data-testid="auto-generation"]').click();
        cy.get('[data-testid="file-document-submit-document"]').click();

        cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should(
          'exist',
        );
        cy.get('[data-testid="submit-entry-of-appearance-button"]').click();

        cy.get('[data-testid="document-download-link-EA"]').should(
          'contain.text',
          'Entry of Appearance for Respondent',
        );
        // should not allow filing Entry of Appearance once already associated
        cy.get('[data-testid="button-file-document"]').click();
        cy.get('[data-testid="ready-to-file"]').click();
        selectTypeaheadInput(
          'complete-doc-document-type-search',
          'Entry of Appearance',
        );
        cy.get('[data-testid="submit-document"]').click();
        cy.get('[data-testid="error-alert"]').should('be.visible');
      });
    });
  });

  describe('Upload File Entry of Appearance', () => {
    it('should allow manual upload and subsequent filing of Entry of Appearance', () => {
      const primaryFilerName = 'John';

      loginAsPetitioner();
      petitionerCreatesElectronicCase(primaryFilerName).then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        loginAsIrsPractitioner1();
        externalUserSearchesDocketNumber(docketNumber);
        cy.get('[data-testid="button-first-irs-document"]').click();

        selectTypeaheadInput(
          'complete-doc-document-type-search',
          'Entry of Appearance',
        );
        cy.get('[data-testid="submit-document"]').click();

        cy.get('[data-testid="manual-generation-label"]').click();
        uploadFile('primary-document');
        cy.get('[data-testid="file-document-submit-document"]').click();

        cy.get('[data-testid="redaction-acknowledgement-label"]').click();
        cy.get('[data-testid="file-document-review-submit-document"]').click();

        cy.get('[data-testid="document-download-link-EA"]').should(
          'have.text',
          'Entry of Appearance for Respondent',
        );
      });
    });
  });
});
