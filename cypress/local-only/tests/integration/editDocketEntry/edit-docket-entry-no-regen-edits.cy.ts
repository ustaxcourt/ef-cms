import { attachFile } from '../../../../helpers/file/upload-file';
import { assertDocketEntryPageCount } from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Spec (per coversheet-gaps/SPEC.md): the Edit Docket Entry no-regen
 * list contains Filed → Lodged toggle, Additional info 1 without the
 * checkbox, Additional info 2, Attachments, Certificate of service
 * date (when CoS is already on — a follow-up edit), Filed by, Objections
 * (motions), and Add to pending report.
 *
 * This bundles the simpler no-regen edits into ONE save to verify the
 * regen predicate ignores all of them at once — pages stay at 2 and the
 * EXH entry's eventCode does not change.
 *
 * Bundle exercised in this test:
 *   - Additional info 1 (without checking add-to-coversheet)
 *   - Additional info 2
 *   - Attachments
 *   - Filed by (textarea — the entry is already served, so
 *     FilingPartiesForm renders the editable filedBy textarea
 *     rather than the filer checkboxes)
 *   - Add to pending report (Track document checkbox)
 *
 * Not exercised here (each pinned by a separate test in this suite):
 *   - Filed → Lodge toggle — toggling lodged on changes the displayed
 *     eventCode from EXH to MISCL via the lodged-override in
 *     getFormattedCaseDetail, which would conflict with the
 *     page-count lookup-by-eventCode used by this bundled assertion.
 *   - Certificate of service DATE alone — see
 *     `edit-docket-entry-cos-date-only-no-regen.cy.ts`
 *   - Objections (motions) — see
 *     `edit-docket-entry-motion-objections-no-regen.cy.ts`
 *
 * Regression signal: if any field in the exercised bundle is added to
 * the regen trigger list, pages would land at 3.
 */
describe('Edit Docket Entry no-regen edits leave the coversheet untouched', () => {
  it('does not regenerate the coversheet for the combined no-regen Document Info bundle', () => {
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
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'EXH', expected: '2' });

      cy.get('[data-testid^="docket-entry-eventCode-"]')
        .filter((_, el) => /\bEXH\b/.test(el.textContent || ''))
        .invoke('attr', 'data-testid')
        .then(cellTestId => {
          const match = (cellTestId || '').match(/docket-entry-eventCode-(\d+)/);
          if (!match) {
            throw new Error(
              `Could not resolve EXH docket entry index from data-testid: ${cellTestId}`,
            );
          }
          const docketRecordIndex = match[1];
          cy.visit(
            `/case-detail/${docketNumber}/docket-entry/${docketRecordIndex}/edit-meta`,
          );

          // Apply the no-regen bundle in one form save.
          cy.get('#additional-info').type('Edit-meta info, no checkbox');
          // Deliberately leave add-to-coversheet unchecked.
          cy.get('#additional-info2').type('Edit-meta additional info 2');
          cy.get('#attachments').check({ force: true });
          // Filed by — the entry is served, so FilingPartiesForm renders
          // the editable "Filed by" textarea instead of filer checkboxes.
          // Append text to exercise the no-regen `filedBy` field.
          cy.get('#filed-by').type(' (edit-meta edit)');
          cy.get('#pending').check({ force: true });

          cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');

          // No regen: pages must still be 2 on the lodged EXH entry.
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'EXH', expected: '2' });
        });
    });
  });
});
