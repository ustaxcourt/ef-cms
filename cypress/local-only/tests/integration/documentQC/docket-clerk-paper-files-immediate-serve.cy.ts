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
 * filing and serves it immediately (NOT via save-for-later), a coversheet
 * IS added to the document on the docket record. This pins the
 * straight-serve path of addPaperFilingInteractor: with isSavingForLater
 * = false, `enqueueAddCoversheet` runs and the docket-entry PDF lands at
 * original + 1 pages.
 *
 * Companion to docket-clerk-save-for-later-then-serve-coversheet.cy.ts,
 * which pins the two-step save-then-serve variant.
 *
 * Regression signal: numberOfPages must equal original (1) + 1 = 2. A
 * regression that drops `enqueueAddCoversheet` from the direct-serve
 * path would land at 1.
 */
describe('Docket Clerk paper-files and serves immediately — coversheet on docket entry', () => {
  it('adds a coversheet when a paper filing is added and served in one step', () => {
    const title = 'immediate-serve notice';

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

      // Serve immediately — no save-for-later step.
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Post-serve: coversheet added, so original (1) + 1 = 2 pages.
      goToCase(docketNumber);
      cy.get('[data-testid^="docket-entry-eventCode-"]')
        .filter((_, el) => (el.textContent || '').trim() === 'NOT')
        .first()
        .parents('tr')
        .find('.number-of-pages')
        .should('have.text', '2');
    });
  });
});
