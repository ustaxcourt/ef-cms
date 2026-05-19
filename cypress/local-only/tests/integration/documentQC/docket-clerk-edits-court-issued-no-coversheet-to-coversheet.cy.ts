import { attachFile } from '../../../../helpers/file/upload-file';
import { assertDocketEntryPageCount } from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Spec (per COVERSHEETS.md): when a Docket Clerk adds a Court issued
 * document that does NOT have a coversheet, saves it, then edits the
 * document type to a Court issued doc that HAS a coversheet, the spec
 * says "coversheet is added to the document" — i.e. pages 1 → 2.
 *
 * Actual current behavior: editing an existing court-issued docket
 * entry via /edit-court-issued routes through
 * `updateCourtIssuedDocketEntryInteractor`, which updates metadata only
 * and does NOT call addCoversheet on the type swap. The MISC entry
 * starts at 1 page (sample.pdf, no coversheet for the no-coversheet
 * type); after editing to RM the stored PDF is untouched, so pages
 * stay at 1.
 *
 * Note: this test uses Miscellaneous as the no-coversheet starting type
 * rather than the spec example (Opinion). Opinions go through the
 * signed-document flow with judge selection, which is orthogonal to the
 * coversheet rule being verified.
 *
 * This test pins the *actual* behavior so a future change toward the
 * spec is visible. If addCoversheet is added to the edit path for a
 * type swap to a coversheet-requiring type, this assertion flips to 2.
 *
 * Regression signal: a climb from 1 → 2 would mean the addCoversheet
 * behavior described in COVERSHEETS.md has been implemented.
 */
describe('Docket Clerk edits Court Issued no-coversheet doc to a coversheet doc', () => {
  it('leaves page count unchanged (pages 1 → 1) when editing Miscellaneous to Returned Mail — current behavior, see COVERSHEETS.md for spec target', () => {
    const description = `misc draft ${Date.now()}`;

    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk();
      cy.visit(`/case-detail/${docketNumber}/upload-court-issued`);
      cy.get('#upload-description').type(description);
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: 'input#primary-document-file',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('#save-uploaded-pdf-button').click();
      cy.get('#add-court-issued-docket-entry-button').click();

      // Save MISC as a draft — appears in My Document QC > In Progress.
      selectTypeaheadInput(
        'court-issued-document-type-search',
        'Miscellaneous',
      );
      cy.get('[data-testid="save-docket-entry-button"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.url().should('not.contain', '/add-court-issued-docket-entry');

      // Open the draft from In Progress and route into edit-court-issued.
      cy.visit('document-qc/my/inProgress');
      cy.get('.case-link').contains(description).click();
      cy.url().should('include', 'edit-court-issued');

      // Change type to Returned Mail (has coversheet, isUnservable) and
      // save. RM goes straight to the docket record on save.
      selectTypeaheadInput(
        'court-issued-document-type-search',
        'Returned Mail',
      );
      // RM is unservable, so a Filed date is required after the swap.
      cy.get('input#date-received-picker').type('11/01/2023');
      cy.get('[data-testid="save-docket-entry-button"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Pages unchanged — updateCourtIssuedDocketEntryInteractor updates
      // metadata only; it does not call addCoversheet on the type swap,
      // so the RM entry still reports 1 page (just the original
      // sample.pdf).
      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'RM', expected: '1' });
    });
  });
});
