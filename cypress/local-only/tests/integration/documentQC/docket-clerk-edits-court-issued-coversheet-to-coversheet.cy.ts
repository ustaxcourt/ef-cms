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
 * document that has a coversheet (e.g. Returned Mail) and then edits it
 * to a different Court issued doc that also has a coversheet (e.g.
 * U.S.C.A.), the spec says "new coversheet is appended to the front of
 * the doc (original coversheet still exists)" — i.e. pages 2 → 3.
 *
 * Actual current behavior: editing an existing court-issued docket
 * entry via /edit-court-issued routes through
 * `updateCourtIssuedDocketEntryInteractor`, which updates metadata only
 * and does NOT regenerate or append a coversheet. The stored PDF stays
 * untouched, so pages stay at 2 across the RM → USCA edit.
 *
 * This test pins the *actual* behavior so a future change toward the
 * spec is visible. If the production path is updated to append a new
 * coversheet on type swap, this assertion needs to flip to 3.
 *
 * Regression signal: a drop from 2 → 1 would mean the underlying PDF
 * lost its original coversheet; a climb to 3 would mean the append
 * behavior described in COVERSHEETS.md has been implemented.
 */
describe('Docket Clerk edits Court Issued coversheet doc to another coversheet doc', () => {
  it('leaves page count unchanged (pages 2 → 2) when editing Returned Mail to U.S.C.A. — current behavior, see COVERSHEETS.md for spec target', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk();
      cy.visit(`/case-detail/${docketNumber}/upload-court-issued`);
      cy.get('#upload-description').type('to petitioner');
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: 'input#primary-document-file',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('#save-uploaded-pdf-button').click();
      cy.get('#add-court-issued-docket-entry-button').click();

      selectTypeaheadInput(
        'court-issued-document-type-search',
        'Returned Mail',
      );
      // Returned Mail is unservable, so the form requires a Filed date.
      cy.get('input#date-received-picker').type('11/01/2023');
      cy.get('[data-testid="save-docket-entry-button"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.url().should('not.contain', '/add-court-issued-docket-entry');

      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'RM', expected: '2' });

      // Look up the RM docketEntryId, then navigate to the edit page.
      cy.task<{ docketEntryId: string }[]>(
        'getDocketEntryIdsByDocketNumberAndEventCode',
        { docketNumber, eventCode: 'RM' },
      ).then(rows => {
        expect(rows.length).to.be.greaterThan(0);
        const { docketEntryId } = rows[0];
        cy.visit(
          `/case-detail/${docketNumber}/documents/${docketEntryId}/edit-court-issued`,
        );

        // Change the type from Returned Mail to U.S.C.A.
        selectTypeaheadInput('court-issued-document-type-search', 'U.S.C.A');
        // U.S.C.A title is `U.S.C.A [anything]` — supply the free-text.
        cy.get('[data-testid="document-description-input"]').clear();
        cy.get('[data-testid="document-description-input"]').type(
          'updated citation',
        );
        cy.get('[data-testid="save-docket-entry-button"]').click();
        cy.get('[data-testid="loading-overlay"]').should('not.exist');

        // Pages unchanged — updateCourtIssuedDocketEntryInteractor
        // updates metadata only; it does not call addCoversheet, so the
        // stored PDF and numberOfPages remain at 2.
        goToCase(docketNumber);
        assertDocketEntryPageCount({ eventCode: 'USCA', expected: '2' });
      });
    });
  });
});
