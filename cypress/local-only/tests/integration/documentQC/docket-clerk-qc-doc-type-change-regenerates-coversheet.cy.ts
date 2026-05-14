import { attachFile } from '../../../../helpers/file/upload-file';
import {
  assertDocketEntryPageCount,
  waitForDocketEntryByEventCode,
} from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Single-case e-file: a private practitioner files an Exhibit (sample.pdf, 1
 * page). The petitioner-side upload prepends 1 coversheet, so the docket
 * entry lands at numberOfPages = 2. A docket clerk picks the entry up via
 * Section Document QC and adds additionalInfo with addToCoversheet=true,
 * which changes the title surfaced by getDocumentTitleWithAdditionalInfo
 * and getDocumentTitleForNoticeOfChange. That makes needsNewCoversheet=true
 * (so the interactor synchronously regenerates the coversheet — pages
 * must remain 2, NOT 3 stacked or 1 dropped) AND
 * needsNoticeOfDocketChange=true (a NODC docket entry is written).
 *
 * NODC presence is verified against the database (cy.task) rather than the
 * docket-record UI to avoid racing the post-QC table refresh.
 */
describe('Docket Clerk QC title change regenerates the coversheet (single case)', () => {
  it('replaces the coversheet (pages stay 2) and writes a Notice of Docket Change when QC changes the title via additionalInfo', () => {
    const primaryFilerName = 'Cody';
    const additionalInfo = 'QC Added Info';

    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

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

      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid=work-item-${docketNumber}]`)
        .find(`[data-testid=work-item-document-link-${docketNumber}]`)
        .click();
      cy.get('[data-testid="additional-info-primary-document-form"]')
        .should('be.visible')
        .type(additionalInfo);
      cy.get('[data-testid="add-to-coversheet-primary-document-form"]').check({
        force: true,
      });
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get(`[data-testid=work-item-${docketNumber}]`).should('not.exist');

      // QC writes NODC asynchronously after the loading overlay clears,
      // so poll the DB to ride out the write delay.
      waitForDocketEntryByEventCode({ docketNumber, eventCode: 'NODC' });

      // Regression signal: coversheet replaced, not stacked (would be 3),
      // not dropped (would be 1).
      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'EXH', expected: '2' });
    });
  });
});
