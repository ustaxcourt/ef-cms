import { attachFile } from '../../../../helpers/file/upload-file';
import {
  assertDocketEntryPageCount,
  assertNoticeOfDocketChangeDoesNotExist,
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
 * Negative control: complete Section Document QC on a practitioner-filed
 * Exhibit without editing anything. needsNewCoversheet should return false
 * (no diff in receivedAt, certificateOfService, or
 * getDocumentTitleWithAdditionalInfo), and needsNoticeOfDocketChange should
 * return false (no diff in filedBy or getDocumentTitleForNoticeOfChange).
 *
 * This pins the no-op QC behavior: page count stays at 2 AND no NODC entry
 * is written. Protects against an over-eager fix that regenerates the
 * coversheet on every QC completion.
 */
describe('Docket Clerk QC with no edits leaves the coversheet untouched', () => {
  it('does not regenerate the coversheet and does not post a Notice of Docket Change when QC is completed with no edits', () => {
    const primaryFilerName = 'Cody';

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
      // Complete QC without editing anything — pure no-op.
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get(`[data-testid=work-item-${docketNumber}]`).should('not.exist');

      // The QC interactor writes NODC and regenerates the coversheet
      // synchronously inside the request handler, so the rendered docket
      // record on the case detail page is the deterministic signal for
      // both assertions — no fixed waits needed.
      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'EXH', expected: '2' });
      assertNoticeOfDocketChangeDoesNotExist();
    });
  });
});
