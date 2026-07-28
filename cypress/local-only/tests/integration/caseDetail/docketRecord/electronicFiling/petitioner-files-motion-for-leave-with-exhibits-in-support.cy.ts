import { attachFile } from '../../../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { loginAsPetitioner } from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Petitioner files a Motion for Leave to File with Exhibits in Support', () => {
  it('should title the secondary document\'s Exhibit in Support "(Lodged)" under event code MISCL, and exclude it from the Exhibits filter', () => {
    const primaryFilerName = 'John';
    const today = formatNow(FORMATS.MMDDYYYY);
    const todayShort = formatNow(FORMATS.MMDDYY);

    loginAsPetitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsPetitioner();
      externalUserSearchesDocketNumber(docketNumber);

      // Steps 3-4: File a Document.
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();

      // Step 6: select "Motion for Leave to File", then the document being
      // requested leave for ("Which document is this exhibit in support
      // of?" style secondary-document picker).
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Motion for Leave to File',
      );
      selectTypeaheadInput('secondary-doc-secondary-document-type', 'Answer');

      // Step 8: Continue.
      cy.get('[data-testid="submit-document"]').click();

      // Step 7 (ticket): upload the primary document PDF.
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="primary-document-label"]').should(
        'have.class',
        'validated',
      );

      // Motion for Leave to File is a Motion; it requires an objection
      // response before the form can submit.
      cy.get('[data-testid="primaryDocument-objections-No"]').click();

      // Step 8: add a supporting document to the primary Motion; "Exhibit"
      // is a selectable type.
      cy.get('#add-supporting-document-button').click();
      cy.contains('h2', 'Supporting Document 1').should('exist');
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

      // Step 10: upload the document being requested leave to file for
      // (the secondary document).
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="secondary-document"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-secondary-document"]',
      });

      // Step 11: add a supporting document to the secondary document;
      // "Exhibit" is a selectable type here too.
      cy.get('#add-secondary-supporting-document-button').click();
      cy.contains('h2', 'Secondary Supporting Document 1').should('exist');
      cy.get('#secondary-supporting-document-0').select('Exhibit');
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="secondary-supporting-document-file-0"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-secondary-supporting-document-file-0"]',
      });
      cy.get(
        'label[for="secondarySupportingDocuments-0-certificateOfService"]',
      ).click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="secondarySupportingDocuments-0-service-date-picker"]',
      ).type(today);
      cy.get('label[for="secondarySupportingDocuments-0-attachments"]').click();

      // Step 12: "Who are you filing for" is left at its default — a
      // petitioner filing on their own case is pre-selected and can't
      // uncheck themselves.
      cy.get(`[data-testid="filingParty-${primaryFilerName}, Petitioner"]`)
        .parent()
        .find('input')
        .should('be.checked')
        .and('be.disabled');

      // Step 13: Review Filing.
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.contains('h1', 'Review Your Filing').should('exist');

      // The primary Motion's own Exhibit in Support displays with
      // Attachments and Certificate of Service.
      cy.contains(
        '.usa-label',
        'Exhibit in Support of Motion for Leave to File Answer',
      )
        .closest('.grid-row')
        .within(() => {
          cy.contains('Attachment(s)').should('exist');
          cy.contains('Certificate of Service').should('exist');
        });

      // The secondary document's own Exhibit in Support displays too, same
      // format. (The secondary document's own label just reads "Answer",
      // which is also a substring of the two titles above, so it isn't
      // asserted separately here to avoid an ambiguous match.)
      cy.contains('.usa-label', 'Exhibit in Support of Answer')
        .closest('.grid-row')
        .within(() => {
          cy.contains('Attachment(s)').should('exist');
          cy.contains('Certificate of Service').should('exist');
        });

      cy.get('[data-testid="filing-parties-card"]').should(
        'contain',
        primaryFilerName,
      );

      // Step 15: the redaction acknowledgement gates the submit button.
      cy.get('[data-testid="file-document-review-submit-document"]').should(
        'be.disabled',
      );
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').should(
        'not.be.disabled',
      );

      // Step 16: submit the filing.
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get('[data-testid="success-alert"]')
        .should(
          'contain',
          'Document filed and is accessible from the Docket Record.',
        )
        .and('contain', 'Print receipt.');

      // Step 17: a Print receipt link is offered.
      cy.get('[data-testid="success-alert"] a')
        .should('have.attr', 'href')
        .and('not.be.empty');

      // Step 18: verify the Docket Record.
      cy.get('[data-testid="docket-record-table"]').should('exist');

      // The primary Motion for Leave to File (event code M115).
      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'M115')
        .parents('tr')
        .as('motionRow');

      // The primary Motion's own Exhibit in Support keeps the normal EXS
      // event code — it isn't lodged.
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
        // Step 19: coversheet applied — 1-page sample.pdf + generated
        // coversheet = 2.
        cy.get('.number-of-pages').should('have.text', '2');
      });
      cy.get('[data-testid="document-download-link-EXS"]').should(
        'contain',
        'Exhibit in Support of Motion for Leave to File Answer',
      );

      // Step 19: the Motion itself also carries a coversheet.
      cy.get('@motionRow').find('.number-of-pages').should('have.text', '2');

      // The secondary document's Exhibit in Support is lodged: it's
      // retitled "... (Lodged)" and reassigned to event code MISCL instead
      // of EXS. Event code MISCL is not unique on this docket (the
      // secondary document "Answer" itself is also lodged), so scope by
      // the full, unambiguous title text instead.
      cy.contains('#docket-record-table tr', 'Exhibit in Support of Answer').as(
        'lodgedExsRow',
      );
      cy.get('@lodgedExsRow').within(() => {
        cy.contains('(Lodged)').should('exist');
        cy.get('[data-testid^="docket-entry-eventCode-"]').should(
          'have.text',
          'MISCL',
        );
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
          'contain',
          todayShort,
        );
      });

      // Exhibit in Support docs display when the docket record is
      // filtered to show "Exhibits" — but lodged ones (event code MISCL,
      // not EXS) are excluded from that filter.
      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-download-link-EXS"]').should('exist');
      cy.contains(
        '#docket-record-table tr',
        'Exhibit in Support of Answer',
      ).should('not.exist');
    });
  });
});
