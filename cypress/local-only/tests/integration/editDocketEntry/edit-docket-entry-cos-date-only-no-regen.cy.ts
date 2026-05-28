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
 * Spec (per coversheet-gaps/SPEC.md): toggling Certificate of Service
 * ON via Edit Docket Entry IS a positive regen trigger. Editing only
 * the certificateOfServiceDate (with CoS already on) is on the
 * no-regen list.
 *
 * Two-step test:
 *   Step 1 (positive): toggle CoS on with date 01/01/2024 → pages 2 → 3
 *                      (this isolates the positive regen so the
 *                      step-2 negative-control has a clean baseline)
 *   Step 2 (no-regen): change CoS date to 02/15/2024 (CoS stays on) →
 *                      pages stay at 3
 *
 * Regression signal for step 2: if `certificateOfServiceDate` is added
 * to the regen trigger list, pages would land at 4.
 */
describe('Edit Docket Entry Certificate of Service date edit alone leaves the coversheet untouched', () => {
  it('regenerates only on CoS toggle (step 1); editing only the date afterwards does not regenerate (step 2)', () => {
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
          const editMetaUrl = `/case-detail/${docketNumber}/docket-entry/${docketRecordIndex}/edit-meta`;

          // Step 1: toggle CoS on with an initial date — positive regen.
          cy.visit(editMetaUrl);
          cy.get('#certificate-of-service').check({ force: true });
          cy.get('input#service-date-picker').type('01/01/2024');
          cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'EXH', expected: '3' });

          // Step 2: change ONLY the CoS date (CoS stays on) — no regen.
          cy.visit(editMetaUrl);
          cy.get('#certificate-of-service').should('be.checked');
          cy.get('input#service-date-picker').clear();
          cy.get('input#service-date-picker').type('02/15/2024');
          cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'EXH', expected: '3' });
        });
    });
  });
});
