import { attachFile } from '../../../../helpers/file/upload-file';
import { assertDocketEntryPageCount } from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { createAndServeConsolidatedGroup } from '../../../../helpers/fileAPetition/create-consolidated-case-group';
import { externalUserSearchesDocketNumber } from '../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsIrsPractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Spec (per coversheet-gaps/SPEC.md): Pre-8477 simultaneous filing —
 * when a party eFiles a simultaneous doc across a consolidated group,
 * the docket clerk must SERVE it in each individual case. Upon service
 * in each case, a new coversheet is APPENDED to the (shared) underlying
 * doc. For each case the document is served in, a new coversheet
 * appears — so the page count on every case's SIAB row climbs by one
 * per per-case service.
 *
 * Group setup: lead + 1 member (2 cases total).
 *
 * Page count progression (cases share the same underlying PDF, so any
 * coversheet append affects every case's row):
 *   - After eFile across group:           every case → 2 pages
 *   - After serve in lead case:           every case → 3 pages
 *   - After serve in member case:         every case → 4 pages
 *
 * Note: per the spec, "this will be resolved with 8477; the document
 * will only have two coversheets, the original and the new appended one
 * with the service stamp." This test pins the pre-8477 stacking
 * behavior — when 8477 lands, this test will need to be updated to
 * reflect the new bounded count.
 *
 * Regression signal: any per-case serve that does not increment the
 * shared PDF's page count by exactly 1 fails this test.
 */
describe('Pre-8477 — per-case serve of consolidated SIAB stacks coversheets', () => {
  it('appends a new coversheet on the shared PDF for each per-case service', () => {
    createAndServeConsolidatedGroup({ numberOfMemberCases: 1 }).then(
      ({ leadDocketNumber, memberDocketNumbers }) => {
        const allDocketNumbers = [leadDocketNumber, ...memberDocketNumbers];

        // Step 1: associate the IRS practitioner with each case by
        // filing the first-IRS doc (Answer) on every case. Without this,
        // the practitioner can't file SIAB across the group later.
        for (const docketNumber of allDocketNumbers) {
          loginAsIrsPractitioner();
          externalUserSearchesDocketNumber(docketNumber);
          cy.get('[data-testid="button-first-irs-document"]').click();
          selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
          cy.get('[data-testid="submit-document"]').click();
          cy.get('[data-testid="primary-document-label"]').scrollIntoView();
          attachFile({
            filePath: '../../helpers/file/sample.pdf',
            selector: '[data-testid="primary-document"]',
            selectorToAwaitOnSuccess:
              '[data-testid="upload-file-success-primary-document"]',
          });
          cy.get('[data-testid="file-document-submit-document"]').click();
          cy.get('[data-testid="redaction-acknowledgement-label"]').click();
          cy.get('[data-testid="file-document-review-submit-document"]').click();
          cy.showsSuccessMessage(true);
        }

        // Step 2: practitioner files a SIAB on the lead case, scoping
        // across the entire consolidated group. File-time coversheet
        // applies on the shared PDF → every case shows SIAB at 2 pages.
        loginAsIrsPractitioner();
        externalUserSearchesDocketNumber(leadDocketNumber);
        cy.get('[data-testid="button-file-document"]').click();
        cy.get('[data-testid="ready-to-file"]').click();
        selectTypeaheadInput(
          'complete-doc-document-type-search',
          'Simultaneous Answering Brief',
        );
        cy.get('[data-testid="submit-document"]').click();
        attachFile({
          filePath: '../../helpers/file/sample.pdf',
          selector: '[data-testid="primary-document"]',
          selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
        });
        cy.get('#consolidated-group-all').check({ force: true });
        cy.contains('label', 'Respondent').click();
        cy.get('#submit-document').click();
        cy.get('[data-testid="redaction-acknowledgement-label"]').click();
        cy.get('#submit-document').click();
        cy.showsSuccessMessage(true);

        // Pre-QC sanity check: file-time coversheet on every case.
        loginAsDocketClerk();
        cy.get('[data-testid="docket-number-search-input"]').should('exist');
        for (const docketNumber of allDocketNumbers) {
          cy.visit(`/case-detail/${docketNumber}`);
          cy.get('[data-testid="docket-record-table"]').should('exist');
          assertDocketEntryPageCount({ eventCode: 'SIAB', expected: '2' });
        }

        // Step 3: complete Section Document QC for the SIAB on every
        // case — no metadata edits, so no new coversheets. Per spec:
        // "singular coversheet upon QC" (the file-time one).
        for (const docketNumber of allDocketNumbers) {
          cy.get('[data-testid="document-qc-nav-item"]').click();
          cy.get(
            '[data-testid="switch-to-section-document-qc-button"]',
          ).click();
          cy.get(`[data-testid=work-item-${docketNumber}]`)
            .find(`[data-testid=work-item-document-link-${docketNumber}]`)
            .filter((_, el) =>
              /Simultaneous Answering Brief/.test(el.textContent || ''),
            )
            .first()
            .click();
          cy.get('[data-testid="save-and-finish-document-qc"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');
        }

        // QC didn't change the page count.
        for (const docketNumber of allDocketNumbers) {
          cy.visit(`/case-detail/${docketNumber}`);
          cy.get('[data-testid="docket-record-table"]').should('exist');
          assertDocketEntryPageCount({ eventCode: 'SIAB', expected: '2' });
        }

        // Step 4: serve the SIAB from the lead case's docket record.
        // The shared PDF gains a coversheet, so every case's row should
        // climb 2 → 3.
        goToCase(leadDocketNumber);
        cy.get('[data-testid="document-viewer-link-SIAB"]').click();
        cy.get('[data-testid="serve-paper-filed-document"]').click();
        cy.get('[data-testid="confirm-initiate-service-modal"]').should(
          'exist',
        );
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="loading-overlay"]').should('not.exist');

        for (const docketNumber of allDocketNumbers) {
          cy.visit(`/case-detail/${docketNumber}`);
          cy.get('[data-testid="docket-record-table"]').should('exist');
          assertDocketEntryPageCount({ eventCode: 'SIAB', expected: '3' });
        }

        // Step 5: serve the SIAB from the member case's docket record.
        // Shared PDF gains another coversheet → every case 3 → 4.
        goToCase(memberDocketNumbers[0]);
        cy.get('[data-testid="document-viewer-link-SIAB"]').click();
        cy.get('[data-testid="serve-paper-filed-document"]').click();
        cy.get('[data-testid="confirm-initiate-service-modal"]').should(
          'exist',
        );
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="loading-overlay"]').should('not.exist');

        for (const docketNumber of allDocketNumbers) {
          cy.visit(`/case-detail/${docketNumber}`);
          cy.get('[data-testid="docket-record-table"]').should('exist');
          assertDocketEntryPageCount({ eventCode: 'SIAB', expected: '4' });
        }
      },
    );
  });
});
