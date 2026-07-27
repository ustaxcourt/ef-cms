import { attachFile } from '../../../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsDojPractitioner,
  loginAsIrsPractitioner,
  loginAsPetitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkAddsRespondentToCase } from '../../../../../../helpers/caseDetail/caseInformation/petitionsclerk-adds-respondent-to-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';
import { updateCaseStatus } from '../../../../../../helpers/caseDetail/caseInformation/update-case-status';

/**
 * Story 10192 ("Verify other Practitioner Types: DOJ, IRS") — confirms
 * respondent-side practitioners can file the same Motion + "Exhibit in
 * Support" (EXS) combination as a private practitioner, once they've
 * established access to the case.
 *
 * IRS and DOJ gain that access differently: IRS practitioners can pick any
 * case and file their "first IRS document"; DOJ practitioners only see
 * "Represent a Party" once a case is "On Appeal" with a respondent already
 * on file (see doj-practitioner-should-not-be-able-to-represent-case-for-non-appeal-cases.cy.ts).
 */
describe('Respondent-side practitioners file an Exhibit in Support (EXS)', () => {
  it('IRS practitioner files a Motion with an Exhibit in Support after filing their first IRS document', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsIrsPractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="button-first-irs-document"]').click();
      selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
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
      cy.get('[data-testid="success-alert"]').should('exist');

      loginAsIrsPractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Motion for Continuance',
      );
      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="primaryDocument-objections-No"]').click();

      cy.get('#add-supporting-document-button').click();
      cy.get('#supporting-document-0').select('Exhibit');
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="supporting-document-file-0"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-supporting-document-file-0"]',
      });
      cy.get('label[for="supportingDocuments-0-attachments"]').click();

      // IRS practitioner files on behalf of Respondent.
      cy.get('[data-testid="party-irs-practitioner-label"]').click();
      cy.get('[data-testid="file-document-submit-document"]').click();

      cy.contains(
        '.usa-label',
        'Exhibit in Support of Motion for Continuance',
      ).should('exist');

      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get('[data-testid="success-alert"]').should('exist');

      cy.get('[data-testid="document-download-link-EXS"]').should(
        'contain',
        'Exhibit in Support of Motion for Continuance',
      );
      cy.contains(
        '#docket-record-table tr',
        'Exhibit in Support of Motion for Continuance',
      )
        .should('contain', '(Attachment(s))')
        .find('[data-testid="docket-entry-filedBy"]')
        .should('contain', 'Resp.');

      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-download-link-EXS"]').should('exist');
    });
  });

  it('DOJ practitioner files a Motion with an Exhibit in Support after being added as counsel on an On Appeal case', () => {
    const BAR_NUMBER = 'WN7777';

    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      petitionsClerkAddsRespondentToCase(docketNumber, BAR_NUMBER);

      loginAsDocketClerk1();
      goToCase(docketNumber);
      updateCaseStatus('On Appeal');

      // DOJ only sees "Represent a Party" on an On Appeal case with a
      // respondent already on file.
      loginAsDojPractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="request-represent-a-party-button"]').click();
      selectTypeaheadInput(
        'case-association-document-type-search',
        'Entry of Appearance',
      );
      cy.get('[data-testid="auto-generation"]').should('exist');
      cy.get('[data-testid="request-access-submit-document"]').click();
      cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should('exist');
      cy.get('[data-testid="submit-represent-a-party-button"]').click();
      cy.get('[data-testid="document-download-link-EA"]').should('exist');

      loginAsDojPractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Motion for Continuance',
      );
      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="primaryDocument-objections-No"]').click();

      cy.get('#add-supporting-document-button').click();
      cy.get('#supporting-document-0').select('Exhibit');
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="supporting-document-file-0"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-supporting-document-file-0"]',
      });
      cy.get('label[for="supportingDocuments-0-attachments"]').click();

      // DOJ files on behalf of Respondent.
      cy.get('[data-testid="party-irs-practitioner-label"]').click();
      cy.get('[data-testid="file-document-submit-document"]').click();

      cy.contains(
        '.usa-label',
        'Exhibit in Support of Motion for Continuance',
      ).should('exist');

      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get('[data-testid="success-alert"]').should('exist');

      cy.get('[data-testid="document-download-link-EXS"]').should(
        'contain',
        'Exhibit in Support of Motion for Continuance',
      );
      cy.contains(
        '#docket-record-table tr',
        'Exhibit in Support of Motion for Continuance',
      )
        .should('contain', '(Attachment(s))')
        .find('[data-testid="docket-entry-filedBy"]')
        .should('contain', 'Resp.');

      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-download-link-EXS"]').should('exist');
    });
  });
});
