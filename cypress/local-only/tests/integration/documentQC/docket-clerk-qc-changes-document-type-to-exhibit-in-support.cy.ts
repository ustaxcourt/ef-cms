import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';
import { waitForDocketEntryByEventCode } from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';

/**
 * Document QC re-characterization for story 10192: a private practitioner
 * e-files a document that is not an Exhibit in Support (Exhibit(s), EXH). A
 * docket clerk picks it up in Section Document QC, changes the Document Type to
 * "Exhibit in Support", associates it with the served Petition, and completes
 * QC. Completing QC with a changed title writes a Notice of Docket Change
 * (NODC) and surfaces the "QC Completed" message.
 *
 * The seeded case has an electronic petitioner (no paper-service parties), so
 * the print-for-paper-service screen does not apply here.
 */
describe('Docket clerk changes a document type to "Exhibit in Support" during Document QC', () => {
  it('completes QC with the new type, writes a Notice of Docket Change, and shows the retitled EXS entry on the docket record', () => {
    const primaryFilerName = 'Cody';
    const today = formatNow(FORMATS.MMDDYY);

    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      // Practitioner e-files an Exhibit(s) (not an Exhibit in Support).
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

      // Docket clerk opens the work item in Section Document QC.
      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid=work-item-${docketNumber}]`)
        .find(`[data-testid=work-item-document-link-${docketNumber}]`)
        .click();

      // Change the Document Type to "Exhibit in Support".
      selectTypeaheadInput(
        'primary-document-type-search',
        'Exhibit in Support',
      );

      // The "Which document is this exhibit in support of?" section appears;
      // associate with the served Petition.
      cy.contains('Which document is this exhibit in support of?').should(
        'exist',
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
      // Verify the association was selected before completing QC.
      cy.get('[data-testid="previous-document-search"]')
        .find('option:selected')
        .should('contain', 'Petition');

      // Complete QC.
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Routed back to My Document QC with the "QC Completed" banner and the
      // work item removed from the inbox.
      cy.get('[data-testid="success-alert"]')
        .should('contain', 'QC Completed')
        .and('contain', 'has been completed.');
      cy.get(`[data-testid=work-item-${docketNumber}]`).should('not.exist');

      // A Notice of Docket Change is written asynchronously after the overlay
      // clears — poll the DB to ride out the write delay.
      waitForDocketEntryByEventCode({ docketNumber, eventCode: 'NODC' });

      // Case detail: the retitled Exhibit in Support entry is on the docket
      // record under event code EXS with the associated document's title.
      goToCase(docketNumber);
      cy.get('[data-testid="document-viewer-link-EXS"]').contains(
        'Exhibit in Support of Petition',
      );

      // The EXS row shows the event code, today's filed/served date, and the
      // petitioner as Filed By.
      cy.contains('#docket-record-table tr', 'Exhibit in Support of Petition')
        .should('contain', 'EXS')
        .and('contain', today)
        .and('contain', primaryFilerName);

      // The Notice of Docket Change entry records the title change.
      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'NODC').should(
        'exist',
      );

      // Exhibit in Support docs display when filtered to show "Exhibits".
      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-viewer-link-EXS"]').should('exist');
    });
  });
});
