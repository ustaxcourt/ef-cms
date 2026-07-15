import { attachFile } from '../../../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { loginAsPetitioner } from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe(
  'Petitioner files an Exhibit in Support (EXS)',
  { scrollBehavior: 'center' },
  () => {
    it('should file "Exhibit in Support" as the primary document and title it after the associated docketed filing', () => {
      loginAsPetitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        loginAsPetitioner();
        externalUserSearchesDocketNumber(docketNumber);
      });

      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();

      // "Exhibit in Support" is selectable as the e-filed document type
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Exhibit in Support',
      );

      // Nonstandard A requires identifying the associated docketed filing.
      // The label rendered here is "Which document is this exhibit in support of?"
      cy.get('[data-testid="previous-document-search"]')
        .find('option')
        .then($options => {
          const petitionOption = Array.from($options).find(opt =>
            opt.textContent?.includes('Petition'),
          );
          const optionText = petitionOption?.textContent?.trim() || '';
          cy.get('[data-testid="previous-document-search"]').select(optionText);
        });

      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Title follows the pattern "Exhibit in Support of [Document Name]"
      cy.get('[data-testid="document-download-link-EXS"]').should(
        'have.text',
        'Exhibit in Support of Petition',
      );
    });

    it('should file an "Exhibit" supporting document that auto-associates with the primary document being filed', () => {
      loginAsPetitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        loginAsPetitioner();
        externalUserSearchesDocketNumber(docketNumber);
      });

      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput('complete-doc-document-type-search', 'Exhibit(s)');
      cy.get('[data-testid="submit-document"]').click();

      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });

      // "Exhibit" is selectable when adding a Supporting Document. The stored
      // documentType is "Exhibit in Support"; the picker strips " in Support"
      // for display, so the option reads "Exhibit".
      cy.get('#add-supporting-document-button').click();
      cy.get('#supporting-document-0').select('Exhibit');
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="supporting-document-file-0"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-supporting-document-file-0"]',
      });

      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // The supporting document is auto-associated with the primary filing
      // (Exhibit(s)), producing "Exhibit in Support of Exhibit(s)".
      cy.get('[data-testid="document-download-link-EXH"]').should('exist');
      cy.get('[data-testid="document-download-link-EXS"]').should(
        'have.text',
        'Exhibit in Support of Exhibit(s)',
      );
    });
  },
);
