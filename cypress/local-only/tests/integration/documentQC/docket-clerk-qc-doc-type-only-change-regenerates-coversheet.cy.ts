import { attachFile } from '../../../../helpers/file/upload-file';
import {
  assertDocketEntryPageCount,
  waitForDocketEntryByEventCode,
} from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Spec (per coversheet-gaps/SPEC.md): Document Type is on the positive
 * regen whitelist for Document QC. Changing only the document type (with
 * no additionalInfo edit) must regenerate the coversheet — appended on
 * top of the original, so pages climb 2 → 3.
 *
 * Negative-control coverage in
 * `docket-clerk-qc-cosmetic-edit-leaves-coversheet-untouched.cy.ts`
 * pins the no-edit baseline; this test pins the positive trigger for the
 * Document Type field specifically (vs. additionalInfo+checkbox, covered
 * by `docket-clerk-qc-doc-type-change-regenerates-coversheet.cy.ts`).
 *
 * Regression signal: a refactor that drops `eventCode` from the QC regen
 * trigger list would land at 2 pages here.
 */
describe('Docket Clerk QC Document Type change regenerates the coversheet', () => {
  it('appends a new coversheet (pages 2 → 3) when QC changes only the document type', () => {
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

      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid=work-item-${docketNumber}]`)
        .find(`[data-testid=work-item-document-link-${docketNumber}]`)
        .click();

      // Change ONLY the document type — from Exhibit(s) to Memorandum.
      // Leave additionalInfo, addToCoversheet, CoS, etc. untouched.
      selectTypeaheadInput('primary-document-type-search', 'Memorandum');
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get(`[data-testid=work-item-${docketNumber}]`).should('not.exist');

      // QC regenerates the coversheet synchronously; the NODC write is
      // async, so poll for it before reading the docket record.
      waitForDocketEntryByEventCode({ docketNumber, eventCode: 'NODC' });

      // The original docket entry is now under MEMO (not EXH) because the
      // event code change rewrites the entry's eventCode.
      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'MEMO', expected: '3' });
    });
  });
});
