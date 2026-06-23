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
 * Spec (per coversheet-gaps/SPEC.md): Objections (motions) is on the
 * Edit Docket Entry no-regen list. This is hard to bundle into the
 * generic Exhibit no-regen test because `showObjection` is gated on the
 * doc being a motion type (or amendment of a motion).
 *
 * Test flow:
 *   1. Practitioner eFiles a Motion to Proceed Remotely (MOTR, a
 *      Standard scenario motion that doesn't require nonstandard
 *      fields). File-time coversheet → pages = 2.
 *   2. Docket clerk completes QC with no edits → pages stay 2.
 *   3. Docket clerk visits Edit Docket Entry Meta, flips the Objections
 *      radio (No → Unknown), and saves.
 *   4. Page count stays at 2 — objections is no-regen.
 *
 * Regression signal: if `objections` is added to the Edit Docket Entry
 * regen trigger list, pages would climb to 3.
 */
describe('Edit Docket Entry Objections edit leaves the coversheet untouched', () => {
  it('does not regenerate the coversheet when only the Objections radio changes', () => {
    const primaryFilerName = 'Cody';

    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Motion to Proceed Remotely',
      );
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
      cy.get('[data-testid="primaryDocument-objections-No"]').click();
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Complete QC without edits — MOTR entry pages = 2 baseline.
      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid=work-item-${docketNumber}]`)
        .find(`[data-testid=work-item-document-link-${docketNumber}]`)
        .click();
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'MOTR', expected: '2' });

      cy.get('[data-testid^="docket-entry-eventCode-"]')
        .filter((_, el) => /\bMOTR\b/.test(el.textContent || ''))
        .invoke('attr', 'data-testid')
        .then(cellTestId => {
          const match = (cellTestId || '').match(/docket-entry-eventCode-(\d+)/);
          if (!match) {
            throw new Error(
              `Could not resolve MOTR docket entry index from data-testid: ${cellTestId}`,
            );
          }
          const docketRecordIndex = match[1];
          cy.visit(
            `/case-detail/${docketNumber}/docket-entry/${docketRecordIndex}/edit-meta`,
          );

          // Flip Objections radio from No to Unknown.
          cy.get('#objections-Unknown').check({ force: true });

          cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');

          // No regen — pages remain 2.
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'MOTR', expected: '2' });
        });
    });
  });
});
