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
 * document that has a coversheet (e.g. Returned Mail) and then edits
 * the document type to a Court document that does NOT have a
 * coversheet, the spec says "coversheet is removed and document is
 * served" — i.e. pages 2 → 1.
 *
 * Actual current behavior: the edit + serve path
 * (`updateCourtIssuedDocketEntryInteractor` followed by the court-
 * issued service flow) updates metadata and serves the doc, but does
 * NOT call removeCoversheet. The original RM coversheet stays attached
 * to the PDF, so pages stay at 2 across RM → MISC + serve.
 *
 * This test pins the *actual* behavior so a future change toward the
 * spec is visible. If a removeCoversheet step is added to the edit /
 * serve path for newly-no-coversheet types, this assertion needs to
 * flip to 1.
 *
 * Regression signal: a drop from 2 → 1 would mean the removeCoversheet
 * behavior described in COVERSHEETS.md has been implemented; a climb to
 * 3 would mean the serve step is stacking a service-stamp coversheet
 * on top of the existing RM coversheet.
 */
describe('Docket Clerk edits Court Issued coversheet doc to a no-coversheet doc', () => {
  it('leaves page count unchanged (pages 2 → 2) when editing Returned Mail to Miscellaneous and serving — current behavior, see COVERSHEETS.md for spec target', () => {
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

      cy.task<{ docketEntryId: string }[]>(
        'getDocketEntryIdsByDocketNumberAndEventCode',
        { docketNumber, eventCode: 'RM' },
      ).then(rows => {
        expect(rows.length).to.be.greaterThan(0);
        const docketEntryId = rows[0].docketEntryId;
        cy.visit(
          `/case-detail/${docketNumber}/documents/${docketEntryId}/edit-court-issued`,
        );

        // Change type from Returned Mail to Miscellaneous (servable, no
        // coversheet). The Save-and-Serve button appears because the new
        // type is servable.
        selectTypeaheadInput(
          'court-issued-document-type-search',
          'Miscellaneous',
        );
        cy.get('[data-testid="document-description-input"]')
          .clear();
        cy.get('[data-testid="document-description-input"]').type(
          'misc replacement',
        );
        cy.get('[data-testid="serve-to-parties-btn"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="loading-overlay"]').should('not.exist');

        // Pages unchanged — the court-issued edit + serve flow updates
        // metadata and serves the entry without calling removeCoversheet,
        // so the original RM coversheet stays attached and the MISC
        // entry still reports 2 pages.
        goToCase(docketNumber);
        assertDocketEntryPageCount({ eventCode: 'MISC', expected: '2' });
      });
    });
  });
});
