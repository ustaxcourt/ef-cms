import { attachFile } from '../../../../../../helpers/file/upload-file';
import { assertNoticeOfDocketChangeDoesNotExist } from 'cypress/helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { checkA11y } from 'cypress/local-only/support/generalCommands/checkA11y';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { externalUserCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Private practitioner files a Motion with an Exhibit in Support (EXS)', () => {
  it('should file the Exhibit in Support as a supporting document with Certificate of Service and Attachments, and reflect it on the Docket Record', () => {
    const primaryFilerName = 'John';
    const today = formatNow(FORMATS.MMDDYYYY);
    const todayShort = formatNow(FORMATS.MMDDYY);

    loginAsPetitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsPrivatePractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="request-represent-a-party-button"]').click();
      selectTypeaheadInput(
        'case-association-document-type-search',
        'Entry of Appearance',
      );
      cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();
      cy.get('[data-testid="request-access-submit-document"]').click();
      cy.get('[data-testid="submit-represent-a-party-button"]').click();

      cy.get('[data-testid="button-file-document"]').click();
      cy.get(
        '.caseItem a[href="https://ustaxcourt.gov/dawson-user-guides/"]',
      ).should('be.visible');
      checkA11y();
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
      cy.get('[data-testid="primary-document-label"]').should(
        'have.class',
        'validated',
      );

      cy.get('[data-testid="primaryDocument-objections-No"]').click();

      cy.get(
        '[data-testid="primaryDocument-what-can-i-include-button"]',
      ).click();
      cy.get(
        '.what-can-i-include a[href="https://ustaxcourt.gov/dawson-user-guides/"]',
      ).should('be.visible');
      checkA11y();
      cy.contains('.what-can-i-include button', 'Close').click();
      cy.get('.what-can-i-include').should('not.exist');

      cy.get('#add-supporting-document-button').click();
      cy.contains('h2', 'Supporting Document 1').should('exist');
      cy.get('#supporting-document-0')
        .find('option')
        .contains('Exhibit')
        .should('exist');

      cy.get('#supporting-document-0').select('Exhibit');
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="supporting-document-file-0"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-supporting-document-file-0"]',
      });

      cy.get('label[for="supportingDocuments-0-certificateOfService"]').click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="supportingDocuments-0-service-date-picker"]',
      ).type(today);

      cy.get('label[for="supportingDocuments-0-attachments"]').click();

      cy.get(
        `[data-testid="filingParty-${primaryFilerName}, Petitioner"]`,
      ).click();

      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.contains('h1', 'Review Your Filing').should('exist');

      cy.contains('.usa-label', 'Exhibit in Support of Motion for Continuance')
        .closest('.grid-row')
        .within(() => {
          cy.contains('Attachment(s)').should('exist');
          cy.contains('Certificate of Service').should('exist');
        });
      cy.get('[data-testid="filing-parties-card"]').should(
        'contain',
        primaryFilerName,
      );

      cy.get('[data-testid="file-document-review-submit-document"]').should(
        'be.disabled',
      );
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').should(
        'not.be.disabled',
      );

      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get('[data-testid="success-alert"]')
        .should(
          'contain',
          'Document filed and is accessible from the Docket Record.',
        )
        .and('contain', 'Print receipt.');

      cy.get('[data-testid="success-alert"] a')
        .should('have.attr', 'href')
        .and('not.be.empty');

      cy.get('[data-testid="docket-record-table"]').should('exist');

      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'M006')
        .parents('tr')
        .as('motionRow');
      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'EXS')
        .parents('tr')
        .as('exsRow');

      cy.get('@exsRow').within(() => {
        cy.get('[data-testid^="docket-entry-index-"]')
          .invoke('text')
          .should('not.be.empty');
        cy.get('[data-testid^="docket-entry-filedDate-"]').should(
          'have.text',
          todayShort,
        );
        cy.get('[data-testid="docket-entry-filedBy"]').should(
          'contain',
          primaryFilerName,
        );
        cy.get('[data-testid="docket-record-cell-not-served"]').should(
          'not.contain',
          'Not served',
        );
        cy.get('[data-testid="docket-record-cell-not-served"]').should(
          'contain',
          todayShort,
        );
        cy.get('.number-of-pages').should('have.text', '2');
      });

      cy.get('[data-testid="document-download-link-EXS"]').should(
        'contain',
        'Exhibit in Support of Motion for Continuance',
      );
      cy.contains(
        '#docket-record-table tr',
        'Exhibit in Support of Motion for Continuance',
      )
        .should('contain', '(Attachment(s))')
        .and('contain', '(C/S');

      cy.get('@motionRow').find('.number-of-pages').should('have.text', '2');

      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-download-link-EXS"]').should('exist');

      loginAsDocketClerk();
      cy.task<{ docketEntryId: string }[]>(
        'getDocketEntryIdsByDocketNumberAndEventCode',
        { docketNumber, eventCode: 'EXS' },
      ).then((entries: { docketEntryId: string }[]): void => {
        expect(entries).to.have.length(1);
        cy.visit(
          `/case-detail/${docketNumber}/documents/${entries[0].docketEntryId}/edit`,
        );
      });
      cy.get('[data-testid="previous-document-search"] option:selected').should(
        'contain.text',
        'Motion for Continuance',
      );
      checkA11y();
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="success-alert"]').should('contain', 'QC Completed');

      goToCase(docketNumber);
      assertNoticeOfDocketChangeDoesNotExist();
      cy.get('[data-testid="edit-EXS"]').click();
      cy.get('[data-testid="previous-document-search"] option:selected').should(
        'contain.text',
        'Motion for Continuance',
      );
      checkA11y();
    });
  });

  it('should file "Exhibit in Support" as the primary document, with Certificate of Service and Attachments, and reflect it on the Docket Record', () => {
    const primaryFilerName = 'John';
    const today = formatNow(FORMATS.MMDDYYYY);
    const todayShort = formatNow(FORMATS.MMDDYY);

    loginAsPetitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsPrivatePractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="request-represent-a-party-button"]').click();
      selectTypeaheadInput(
        'case-association-document-type-search',
        'Entry of Appearance',
      );
      cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();
      cy.get('[data-testid="request-access-submit-document"]').click();
      cy.get('[data-testid="submit-represent-a-party-button"]').click();

      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();

      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Exhibit in Support',
      );

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
      cy.get('[data-testid="primary-document-label"]').should(
        'have.class',
        'validated',
      );

      cy.get('#primaryDocument-certificateOfService-label').click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="primaryDocument-service-date-picker"]',
      ).type(today);

      cy.get('label[for="primaryDocument-attachments"]').click();

      cy.get(
        `[data-testid="filingParty-${primaryFilerName}, Petitioner"]`,
      ).click();

      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.contains('h1', 'Review Your Filing').should('exist');

      cy.contains('.usa-label', 'Exhibit in Support of Petition')
        .closest('.grid-row')
        .within(() => {
          cy.contains('Attachment(s)').should('exist');
          cy.contains('Certificate of Service').should('exist');
        });
      cy.get('[data-testid="filing-parties-card"]').should(
        'contain',
        primaryFilerName,
      );

      cy.get('[data-testid="file-document-review-submit-document"]').should(
        'be.disabled',
      );
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').should(
        'not.be.disabled',
      );

      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get('[data-testid="success-alert"]')
        .should(
          'contain',
          'Document filed and is accessible from the Docket Record.',
        )
        .and('contain', 'Print receipt.');

      cy.get('[data-testid="success-alert"] a')
        .should('have.attr', 'href')
        .and('not.be.empty');

      cy.get('[data-testid="docket-record-table"]').should('exist');

      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'EXS')
        .parents('tr')
        .as('exsRow');

      cy.get('@exsRow').within(() => {
        cy.get('[data-testid^="docket-entry-index-"]')
          .invoke('text')
          .should('not.be.empty');
        cy.get('[data-testid^="docket-entry-filedDate-"]').should(
          'have.text',
          todayShort,
        );
        cy.get('[data-testid="docket-entry-filedBy"]').should(
          'contain',
          primaryFilerName,
        );
        cy.get('[data-testid="docket-record-cell-not-served"]').should(
          'not.contain',
          'Not served',
        );
        cy.get('[data-testid="docket-record-cell-not-served"]').should(
          'contain',
          todayShort,
        );
        cy.get('.number-of-pages').should('have.text', '2');
      });

      cy.get('[data-testid="document-download-link-EXS"]').should(
        'contain',
        'Exhibit in Support of Petition',
      );
      cy.contains('#docket-record-table tr', 'Exhibit in Support of Petition')
        .should('contain', '(Attachment(s))')
        .and('contain', '(C/S');

      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-download-link-EXS"]').should('exist');
    });
  });
});
