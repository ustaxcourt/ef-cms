import { attachSamplePdfFile } from '../../../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import {
  loginAsIrsPractitioner1,
  loginAsIrsPractitioner2,
  loginAsPetitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('IRS Practitioner files Entry of Appearance as First IRS Document', () => {
  describe('Auto Generate Entry of Appearance', () => {
    it('should allow auto-generation and subsequent filing of the Entry of Appearance', () => {
      const primaryFilerName = 'John';

      loginAsPetitioner();
      externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
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

        cy.get('[data-testid="auto-generated-pdf-preview"]').should('exist');
        cy.get('[data-testid="submit-auto-generated-document-button"]').click();

        cy.get('[data-testid="document-download-link-EA"]').should(
          'contain.text',
          'Entry of Appearance for Respondent',
        );
        // should not allow filing Entry of Appearance once already associated:
        // the application enforces this by filtering "Entry of Appearance" out
        // of the document-type typeahead options for an IRS practitioner whose
        // case already has an IRS filing
        cy.get('[data-testid="button-file-document"]').click();
        cy.get('[data-testid="ready-to-file"]').click();
        cy.get(
          '[data-testid="complete-doc-document-type-search"] .select-react-element__control',
        )
          .should('be.visible')
          .click();
        cy.get(
          '[data-testid="complete-doc-document-type-search"] .select-react-element__input',
        ).type('Entry of Appearance', { force: true });
        cy.get(
          '[data-testid="complete-doc-document-type-search"] .select-react-element__menu',
        )
          .should('be.visible')
          .and('not.contain.text', 'Entry of Appearance');
      });
    });
  });

  describe('Upload File Entry of Appearance', () => {
    it('should allow manual upload and subsequent filing of Entry of Appearance', () => {
      const primaryFilerName = 'John';

      loginAsPetitioner();
      externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
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
        attachSamplePdfFile('primary-document');
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

  describe('IRS Practitioner Access', () => {
    it('should not let IRS practitioner not associated with case file a document on it after first appearance is filed', () => {
      loginAsPetitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        // file first appearance
        loginAsIrsPractitioner1();
        externalUserSearchesDocketNumber(docketNumber);
        cy.get('[data-testid="button-first-irs-document"]').click();

        selectTypeaheadInput(
          'complete-doc-document-type-search',
          'Entry of Appearance',
        );
        cy.get('[data-testid="submit-document"]').click();

        cy.get('[data-testid="manual-generation-label"]').click();
        attachSamplePdfFile('primary-document');
        cy.get('[data-testid="file-document-submit-document"]').click();

        cy.get('[data-testid="redaction-acknowledgement-label"]').click();
        cy.get('[data-testid="file-document-review-submit-document"]').click();

        cy.get('[data-testid="document-download-link-EA"]').should(
          'have.text',
          'Entry of Appearance for Respondent',
        );

        // Second IRS practitioner tries to file on case
        loginAsIrsPractitioner2();
        cy.visit(
          `/case-detail/${docketNumber}/before-you-file-a-document`,
        ).then(() => {
          cy.url().should('include', '/404');
        });
        cy.visit(`/case-detail/${docketNumber}/file-a-document`).then(() => {
          cy.url().should('include', '/404');
        });
        cy.visit(`/case-detail/${docketNumber}/file-a-document/details`).then(
          () => {
            cy.url().should('include', '/404');
          },
        );
        cy.visit(`/case-detail/${docketNumber}/file-a-document/review`).then(
          () => {
            cy.url().should('include', '/404');
          },
        );
      });
    });
  });
});
