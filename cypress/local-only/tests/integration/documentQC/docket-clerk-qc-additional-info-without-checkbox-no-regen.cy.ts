import { attachFile } from '../../../../helpers/file/upload-file';
import {
  assertDocketEntryPageCount,
  assertNoticeOfDocketChangeDoesNotExist,
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
 * Spec (per coversheet-gaps/SPEC.md): "Additional info 1 (without checking
 * *add to coversheet*)" is one of the explicit no-regen exceptions in
 * Document QC. The current code achieves this by virtue of
 * getDocumentTitleWithAdditionalInfo only appending additionalInfo when
 * addToCoversheet is true — so if the box is left unchecked, the title
 * does not change and needsNewCoversheet / needsNoticeOfDocketChange
 * both return false.
 *
 * Negative-control test: a practitioner files an Exhibit (sample.pdf, 1
 * page; petitioner-side upload prepends 1 coversheet → numberOfPages=2),
 * then a Docket Clerk completes Section Document QC and ONLY types
 * additionalInfo, intentionally leaving the addToCoversheet checkbox
 * UNCHECKED. Expected: numberOfPages stays at 2 (no new coversheet) and
 * no Notice of Docket Change is written.
 *
 * Regression signal: a refactor that always concatenates additionalInfo
 * into the title — or that adds additionalInfo to the regen trigger list
 * without preserving the addToCoversheet gate — would land at 3 pages
 * here, and a stray NODC entry would appear.
 */
describe('Docket Clerk QC with additionalInfo but addToCoversheet unchecked does not regenerate the coversheet', () => {
  it('does not regenerate the coversheet and does not post a Notice of Docket Change when additionalInfo is added without the add-to-coversheet checkbox', () => {
    const primaryFilerName = 'Cody';
    const additionalInfo = 'QC Added Info — not on coversheet';

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
      // Type additionalInfo but DELIBERATELY do NOT check the
      // add-to-coversheet box — the spec exception we are pinning.
      cy.get('[data-testid="additional-info-primary-document-form"]')
        .should('be.visible')
        .type(additionalInfo);
      cy.get('[data-testid="add-to-coversheet-primary-document-form"]').should(
        'not.be.checked',
      );
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get(`[data-testid=work-item-${docketNumber}]`).should('not.exist');

      // The QC interactor decides synchronously whether to regenerate the
      // coversheet and write an NODC; both are gated on the title diff,
      // which addToCoversheet=false suppresses. So once the loading
      // overlay clears, the docket-record state is the deterministic
      // signal for both assertions.
      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'EXH', expected: '2' });
      assertNoticeOfDocketChangeDoesNotExist();
    });
  });
});
