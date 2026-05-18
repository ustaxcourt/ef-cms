import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';

/**
 * Spec (per coversheet-gaps/SPEC.md): when a Docket Clerk adds a paper
 * filing and clicks **save for later**, NO coversheet is added at save
 * time — the saved entry on the docket record reflects the original
 * uploaded PDF page count only. When the Docket Clerk later returns to
 * the in-progress entry and serves it, a coversheet IS added to the
 * document on the docket record.
 *
 * This pins the two-step behavior: addPaperFilingInteractor skips
 * `enqueueAddCoversheet` when `isSavingForLater` is true; the subsequent
 * `serveDocketEntry` path in editPaperFilingInteractor enqueues it.
 *
 * Regression signal — pre-serve: numberOfPages must equal the original
 * (sample.pdf, 1 page). A regression that fires `enqueueAddCoversheet`
 * at save-for-later time would land at 2 pages here.
 * Regression signal — post-serve: numberOfPages must equal original + 1
 * (= 2). A regression that drops the coversheet enqueue from
 * `serveDocketEntry` would land at 1.
 */
describe('Docket Clerk save-for-later then serve paper filing — coversheet only after serve', () => {
  it('saves with no coversheet, then adds the coversheet only after the entry is served', () => {
    const title = 'save-for-later notice';

    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-paper-filing"]').click();

      cy.get(
        '[data-testid="primary-document-type-search"] .select-react-element__input',
      ).type('Notice');
      cy.get('.select-react-element__option')
        .contains(/^Notice$/)
        .click();

      cy.get('input#date-received-picker').type('11/01/2023');
      cy.get('input#free-text').type(title);
      cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();
      cy.get('[data-testid="upload-pdf-button"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: 'input#primaryDocumentFile-file',
        selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
      });

      cy.get('[data-testid="save-for-later"]').click();
      cy.get('[data-testid="success-alert"]').contains(
        'Your entry has been added to the docket record.',
      );

      // Pre-serve assertion: docket record shows the saved entry without
      // a coversheet — numberOfPages equals the uploaded PDF page count.
      // Exact eventCode matching (not substring) — the petition-service
      // step already created a NOTR entry on the case, and cy.contains
      // substring-matches "NOT" against "NOTR".
      goToCase(docketNumber);
      assertNotEntryPageCount('1');

      // Pick the saved entry back up from My Document QC (in-progress)
      // and serve it.
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get(
        '[data-testid="individual-work-queue-in-progress-button"]',
      ).click();
      cy.get(
        `[data-testid="${docketNumber}-qc-item-row"] [data-testid="qc-link"]`,
      ).click();
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Post-serve assertion: serving enqueues the coversheet, so
      // numberOfPages is now original (1) + coversheet (1) = 2.
      goToCase(docketNumber);
      assertNotEntryPageCount('2');
    });
  });
});

// Exact-match assertion for the paper-filed Notice entry (eventCode = 'NOT').
// Avoids substring collisions with NOTR / NODC / etc. that may already be on
// the case from upstream service flows.
function assertNotEntryPageCount(expected: string) {
  cy.get('[data-testid^="docket-entry-eventCode-"]')
    .filter((_, el) => (el.textContent || '').trim() === 'NOT')
    .first()
    .parents('tr')
    .find('.number-of-pages')
    .should('have.text', expected);
}
