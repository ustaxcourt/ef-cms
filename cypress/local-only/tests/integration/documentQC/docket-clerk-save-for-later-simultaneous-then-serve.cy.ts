import { attachFile } from '../../../../helpers/file/upload-file';
import { assertDocketEntryPageCount } from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Spec (per coversheet-gaps/SPEC.md): when a Docket Clerk paper-files a
 * simultaneous document (e.g. SIAB), saves it for later, then later
 * serves it from the docket, a coversheet IS added to the document on
 * the docket record (with the service stamp). Companion to:
 *   - paper-files-simultaneous-immediate-serve.cy.ts (5b)
 *   - save-for-later-then-serve-coversheet.cy.ts (3b, non-simultaneous)
 *
 * Regression signal — pre-serve: docket entry pages = 1 (the
 * save-for-later path skips enqueueAddCoversheet).
 * Regression signal — post-serve: docket entry pages = 2 (the
 * serveDocketEntry path enqueues the coversheet on a simultaneous entry
 * exactly as it does on non-simultaneous).
 */
describe('Docket Clerk save-for-later simultaneous paper filing, then serve — coversheet only after serve', () => {
  it('saves SIAB with no coversheet, then adds the coversheet only after the entry is served', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-paper-filing"]').click();

      cy.get(
        '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
      ).type('11/01/2023');

      selectTypeaheadInput(
        'primary-document-type-search',
        'Simultaneous Answering Brief',
      );

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

      // Pre-serve: docket record shows the saved SIAB without a
      // coversheet — pages = 1.
      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'SIAB', expected: '1' });

      // Pick the SIAB back up from My Document QC (in-progress) and
      // serve it.
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

      // Post-serve: serving enqueues the coversheet, so pages 1 → 2.
      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'SIAB', expected: '2' });
    });
  });
});
