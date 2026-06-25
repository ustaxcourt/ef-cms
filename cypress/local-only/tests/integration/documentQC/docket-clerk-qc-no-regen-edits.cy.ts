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
 * Spec (per coversheet-gaps/SPEC.md): the Document QC no-regen list
 * includes Filed → Lodged toggle, Additional info 2, Attachments, Filed
 * by, and Add to pending report. Combining several no-regen edits into
 * a single QC completion verifies the regen predicate ignores all of
 * them at once — pages stay at 2 and no Notice of Docket Change is
 * written. (Additional info 1 w/o checkbox is its own separate test.)
 *
 * Bundle exercised in this test:
 *   - Additional info 2
 *   - Attachments
 *   - Filed by (textarea — the doc is already served when QC begins,
 *     so FilingPartiesForm renders the editable filedBy textarea
 *     rather than the filer checkboxes)
 *   - Add to pending report
 *
 * Note: the Filed → Lodge toggle is verified in isolation rather than
 * as part of this bundle — toggling lodged on changes the displayed
 * eventCode from EXH to MISCL via the lodged-override in
 * getFormattedCaseDetail, which would conflict with the page-count
 * lookup-by-eventCode used by this bundled assertion.
 *
 * Regression signal: if any of these fields is added to the QC regen
 * trigger list, pages would land at 3 and an NODC entry would appear.
 */
describe('Docket Clerk QC no-regen edits leave the coversheet untouched', () => {
  it('does not regenerate the coversheet for the combined no-regen bundle', () => {
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

      // Apply the bundle of no-regen edits in one pass.
      // 1. Type into Additional info 2 (not on the regen whitelist).
      cy.get('#additional-info2').type('QC added additional info 2');
      // 2. Toggle Attachments on (not on the regen whitelist).
      cy.get('#attachments').check({ force: true });
      // 3. Filed by — the entry is already served at e-file time, so
      // FilingPartiesForm renders the editable "Filed by" textarea
      // rather than the filer checkboxes. Append text to exercise the
      // no-regen `filedBy` field.
      cy.get('#filed-by').type(' (QC edit)');
      // 4. Add to pending report (Track document checkbox).
      cy.get('#pending').check({ force: true });

      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get(`[data-testid=work-item-${docketNumber}]`).should('not.exist');

      // No regen + no NODC: page count holds at 2 and the docket record
      // has no NODC entry.
      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'EXH', expected: '2' });
      assertNoticeOfDocketChangeDoesNotExist();
    });
  });
});
