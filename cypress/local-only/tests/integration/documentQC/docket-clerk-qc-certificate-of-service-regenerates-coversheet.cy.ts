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
 * Spec (per coversheet-gaps/SPEC.md): Certificate of Service is on the
 * positive regen whitelist for Document QC. Toggling it on during QC
 * changes the document title and must regenerate the coversheet —
 * appended on top of the original, so pages climb 2 → 3.
 *
 * Regression signal: a refactor that drops `certificateOfService` from
 * the QC regen trigger list would land at 2 pages here.
 */
describe('Docket Clerk QC Certificate of Service edit regenerates the coversheet', () => {
  it('appends a new coversheet (pages 2 → 3) when QC toggles Certificate of Service on', () => {
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

      // Toggle Certificate of Service on, supply a date, and save.
      cy.get('#certificate-of-service').check({ force: true });
      cy.get('input#service-date-picker').type('01/01/2023');
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.get(`[data-testid=work-item-${docketNumber}]`).should('not.exist');

      // NODC writes async; poll for it before reading docket record.
      waitForDocketEntryByEventCode({ docketNumber, eventCode: 'NODC' });

      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'EXH', expected: '3' });
    });
  });
});
