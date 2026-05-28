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
 * Spec (per coversheet-gaps/SPEC.md): when a Docket Clerk adds a Court
 * issued document that has a coversheet (e.g. Returned Mail, U.S.C.A.)
 * and saves it to the docket record, a coversheet is generated.
 *
 * Returned Mail (event code RM) is marked `requiresCoversheet: true` in
 * `courtIssuedEventCodes.ts` and is `isUnservable: true`, so the save
 * path runs without a service step — ideal for isolating the coversheet
 * generation behavior.
 *
 * Regression signal: docket-entry pages must equal original (1) + 1 = 2.
 * A regression that drops the coversheet for RM would land at 1; a
 * regression that double-stacks would land at 3.
 */
describe('Docket Clerk adds a Court Issued document that has a coversheet', () => {
  it('generates a coversheet on save (pages 1 → 2) for a Returned Mail entry', () => {
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

      // Returned Mail entry on the docket record should report pages =
      // sample.pdf (1) + coversheet (1) = 2.
      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'RM', expected: '2' });
    });
  });
});
