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
 * simultaneous document (e.g. SIAB) and serves it immediately, a
 * coversheet IS added to the document on the docket record (with the
 * service stamp). This pins the straight-serve path for simultaneous
 * paper filings — companion to the eFiled SIAB serve test and the
 * non-simultaneous paper-filing immediate-serve test.
 *
 * Regression signal: docket-entry pages must equal original (1) + 1 = 2.
 * A regression that drops the coversheet for simultaneous paper filings
 * at serve time would land at 1.
 */
describe('Docket Clerk paper-files a simultaneous and serves immediately — coversheet on docket entry', () => {
  it('adds a coversheet when a simultaneous paper filing is added and served in one step', () => {
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

      // Serve immediately — no save-for-later.
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Post-serve: coversheet added on the docket record, pages 1 → 2.
      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'SIAB', expected: '2' });
    });
  });
});
