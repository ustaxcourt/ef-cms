import { attachFile } from '../../../../helpers/file/upload-file';
import {
  assertDocketEntryPageCount,
  waitForDocketEntryByEventCode,
} from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { createAndServeConsolidatedGroup } from '../../../../helpers/fileAPetition/create-consolidated-case-group';
import { externalUserSearchesDocketNumber } from '../../../../helpers/advancedSearch/external-user-searches-docket-number';
import {
  loginAsDocketClerk,
  loginAsIrsPractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Reported bug repro: an IRS practitioner files a Simultaneous Answering
 * Brief across every case in a consolidated group (the "All in the
 * consolidated group" radio in the practitioner filing flow). Each case
 * lands a SIAB docket entry sharing a docketEntryId/documentStorageId, so
 * the petitioner-side upload prepends 1 coversheet to the shared PDF —
 * each case's row should show numberOfPages = 2.
 *
 * A docket clerk then opens the Section Document QC work item for the
 * subject case and changes the title via additionalInfo. The QC interactor
 * (completeDocketEntryQCInteractor) loads ONE case, updates its docket
 * entry, posts an NODC for that case, and regenerates the coversheet
 * synchronously. Per spec, the new coversheet is APPENDED on top of the
 * original file-time coversheet (it is not replaced). Because all cases
 * share the docketEntryId, the coversheet regen affects the shared PDF —
 * every sibling case PDF should land at numberOfPages = 3 (1 doc + 1
 * original coversheet + 1 newly-appended QC coversheet).
 *
 * Regression signal: the SIAB entry on EVERY case in the group must
 * report numberOfPages = 3 after QC. A regression that drops the original
 * cover (replace-not-append) shows 2; a regression that fails to
 * regenerate at all also shows 2; a missing-doc regression shows 1.
 */
describe('Practitioner files a SIAB across consolidated cases and a docket clerk QCs the entry', () => {
  it('appends a new coversheet on every case in the group (numberOfPages = 3) after the QC title change', () => {
    createAndServeConsolidatedGroup({ numberOfMemberCases: 1 }).then(
      ({ leadDocketNumber, memberDocketNumbers }) => {
        const allDocketNumbers = [leadDocketNumber, ...memberDocketNumbers];

        // Associate the IRS practitioner with each case by filing the
        // first-IRS doc (Answer). Without this, the practitioner can't
        // file on the case in step 3 below.
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

        // Practitioner files a Simultaneous Answering Brief on the lead
        // case, scoping the filing across the entire consolidated group
        // via the consolidated-group radio.
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
        // IRS practitioner files on behalf of Respondent — pick the party
        // before submitting, otherwise the form blocks with
        // "Select a filing party".
        cy.contains('label', 'Respondent').click();
        cy.get('#submit-document').click();
        cy.get('[data-testid="redaction-acknowledgement-label"]').click();
        cy.get('#submit-document').click();
        cy.showsSuccessMessage(true);

        // Pre-QC: each case should show the SIAB entry with the file-time
        // coversheet already applied (numberOfPages = 2).
        loginAsDocketClerk();
        cy.get('[data-testid="docket-number-search-input"]').should('exist');
        for (const docketNumber of allDocketNumbers) {
          cy.visit(`/case-detail/${docketNumber}`);
          cy.get('[data-testid="docket-record-table"]').should('exist');
          assertDocketEntryPageCount({ eventCode: 'SIAB', expected: '2' });
        }

        // Docket clerk QCs the Section Document QC work item for the
        // subject case and changes the title via additionalInfo. This
        // triggers needsNewCoversheet=true (regen) and
        // needsNoticeOfDocketChange=true (NODC).
        cy.get('[data-testid="document-qc-nav-item"]').click();
        cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
        // Multiple work items per case exist on this case (Answer filed in
        // step 1 + SIAB filed in step 2). Selecting `.first()` would pick
        // up the Answer's work item — match by descriptionDisplay text to
        // route to the SIAB work item explicitly.
        cy.get(`[data-testid=work-item-${leadDocketNumber}]`)
          .find(`[data-testid=work-item-document-link-${leadDocketNumber}]`)
          .filter((_, el) =>
            /Simultaneous Answering Brief/.test(el.textContent || ''),
          )
          .first()
          .click();
        cy.get('[data-testid="additional-info-primary-document-form"]')
          .should('be.visible')
          .type('QC Title Change');
        cy.get(
          '[data-testid="add-to-coversheet-primary-document-form"]',
        ).check({ force: true });
        cy.get('[data-testid="save-and-finish-document-qc"]').click();
        cy.get('[data-testid="loading-overlay"]').should('not.exist');

        // NODC should land on the QC'd case.
        waitForDocketEntryByEventCode({
          docketNumber: leadDocketNumber,
          eventCode: 'NODC',
        });

        // Coversheet regression signal: SIAB entries on EVERY case in
        // the group must report numberOfPages = 3 — the new QC coversheet
        // is appended on top of the original file-time coversheet, so the
        // shared PDF gains a page on every linked case.
        for (const docketNumber of allDocketNumbers) {
          cy.visit(`/case-detail/${docketNumber}`);
          cy.get('[data-testid="docket-record-table"]').should('exist');
          assertDocketEntryPageCount({ eventCode: 'SIAB', expected: '3' });
        }
      },
    );
  });
});
