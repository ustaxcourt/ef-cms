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
 * Spec (per coversheet-gaps/SPEC.md): the Edit Docket Entry positive
 * regen whitelist contains Filed Date, Document Type, Additional info 1
 * (only with the add-to-coversheet checkbox), and Certificate of Service.
 * Each edit appends a new coversheet on top of the existing PDF — pages
 * should climb by one per regenerating edit.
 *
 * This test chains all four positive triggers on the same docket entry.
 * Starting state: practitioner-eFiled Exhibit (sample.pdf, 1 page; the
 * petitioner-side upload prepends 1 coversheet → numberOfPages = 2).
 * After each Edit Docket Entry Meta save, pages climb by one.
 *
 * 2 → 3: Filed date edit
 * 3 → 4: Document type change (Exhibit(s) → Memorandum, EXH → MEMO)
 * 4 → 5: Additional info 1 + add-to-coversheet checkbox
 * 5 → 6: Certificate of Service toggled on
 *
 * Regression signal: a refactor that drops any of `filingDate`,
 * `eventCode`, additionalInfo-w/-checkbox, or `certificateOfService` from
 * the regen predicate would land at a page count one less than the
 * cumulative expected at that step.
 */
describe('Edit Docket Entry positive regen chain', () => {
  it('appends a new coversheet for each Edit Docket Entry Meta positive regen trigger (pages climb 2 → 3 → 4 → 5 → 6)', () => {
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

      // Complete QC without edits — the entry must be COMPLETE before
      // Edit Docket Entry Meta is available.
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

          // Step 1: edit Filed Date → pages 2 → 3.
          cy.visit(editMetaUrl);
          cy.get('input#filing-date-picker').clear();
          cy.get('input#filing-date-picker').type('01/15/2024');
          cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'EXH', expected: '3' });

          // Step 2: change Document Type EXH → MEMO → pages 3 → 4.
          cy.visit(editMetaUrl);
          selectTypeaheadInput(
            'edit-docket-entry-meta-document-type-search',
            'Memorandum',
          );
          cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'MEMO', expected: '4' });

          // Step 3: Additional info 1 + add-to-coversheet checkbox →
          // pages 4 → 5.
          cy.visit(editMetaUrl);
          cy.get('#additional-info').type('Edit-meta added info');
          cy.get('#add-to-coversheet').check({ force: true });
          cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'MEMO', expected: '5' });

          // Step 4: toggle Certificate of Service on → pages 5 → 6.
          cy.visit(editMetaUrl);
          cy.get('#certificate-of-service').check({ force: true });
          cy.get('input#service-date-picker').type('01/01/2024');
          cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'MEMO', expected: '6' });
        });
    });
  });
});
