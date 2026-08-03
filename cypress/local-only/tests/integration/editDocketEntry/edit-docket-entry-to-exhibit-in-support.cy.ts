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
 * Docket clerk re-characterizes an existing served docket entry (that is not
 * already an Exhibit in Support) as "Exhibit in Support" via Edit Docket Entry
 * Meta. Mirrors the TestRail manual case for story 10192.
 *
 * Starting state: a private practitioner e-files an Exhibit(s) (EXH) which the
 * docket clerk QCs to COMPLETE so Edit Docket Entry Meta is available. The
 * clerk then changes the Document Type to "Exhibit in Support", associates it
 * with the served Petition, and adds Attachments + Certificate of Service.
 */
describe('Docket clerk edits a docket entry to "Exhibit in Support" (EXS)', () => {
  it('changes the document type, associates the supporting document, and saves with Attachments + Certificate of Service', () => {
    const primaryFilerName = 'Cody';
    const serviceDate = formatNow(FORMATS.MMDDYYYY);

    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      // Private practitioner e-files an Exhibit(s) to be re-characterized later.
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

      // Complete QC so the entry is COMPLETE and Edit Docket Entry Meta is
      // available to the docket clerk.
      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid=work-item-${docketNumber}]`)
        .find(`[data-testid=work-item-document-link-${docketNumber}]`)
        .click();
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get('[data-testid="success-alert"]').should('exist');

      // Click Edit for the served Exhibit(s) docket entry.
      waitForDocketEntryByEventCode({ docketNumber, eventCode: 'EXH' }).then(
        () => {
          goToCase(docketNumber);
          cy.get('[data-testid="edit-EXH"]', { timeout: 10000 }).should(
            'be.visible',
          );
          cy.get('[data-testid="edit-EXH"]').click();
        },
      );

      // Change the Document Type to "Exhibit in Support".
      selectTypeaheadInput(
        'edit-docket-entry-meta-document-type-search',
        'Exhibit in Support',
      );

      // The "Which document is this exhibit in support of?" section appears.
      cy.contains('Which document is this exhibit in support of?').should(
        'exist',
      );

      // Associate the exhibit with the served Petition.
      cy.get('[data-testid="previous-document-search"]')
        .find('option')
        .then($options => {
          const petitionOption = Array.from($options).find(opt =>
            opt.textContent?.includes('Petition'),
          );
          const optionText = petitionOption?.textContent?.trim() || '';
          cy.get('[data-testid="previous-document-search"]').select(optionText);
        });

      // Select Attachments and Certificate of Service with today's date.
      cy.get('#attachments').check({ force: true });
      cy.get('[data-testid="certificate-of-service-label"]').click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="service-date-picker"]',
      ).type(serviceDate);

      cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Routed back to the Docket Record with the success banner.
      cy.get('[data-testid="success-alert"]').should('exist');

      // Title is "Exhibit in Support of [Document Name]" under event code EXS.
      cy.get('[data-testid="document-viewer-link-EXS"]').contains(
        'Exhibit in Support of Petition',
      );

      // The row shows Attachment(s) and Certificate of Service.
      cy.contains('#docket-record-table tr', 'Exhibit in Support of Petition')
        .should('contain', '(Attachment(s))')
        .and('contain', '(C/S');

      // Exhibit in Support docs display when filtered to show "Exhibits".
      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-viewer-link-EXS"]').should('exist');
    });
  });
});
