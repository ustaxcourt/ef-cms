import { attachFile } from '../../../../helpers/file/upload-file';
import { assertDocketEntryPageCount } from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Spec (per coversheet-gaps/SPEC.md): edits made to the Edit Docket Entry
 * **Service** tab (servedPartiesCode) or **Action(s)** tab (action text,
 * strike, etc.) do NOT regenerate the coversheet. The positive regen
 * whitelist only contains Document Info fields (Filed Date, Document
 * Type, Additional info 1 w/ checkbox, Certificate of Service).
 *
 * Negative-control test: a practitioner files an Exhibit (sample.pdf, 1
 * page; petitioner-side upload prepends 1 coversheet → numberOfPages=2),
 * then a Docket Clerk navigates to Edit Docket Entry Meta, switches to
 * the Service tab, toggles the Parties served radio, and saves. Expected:
 * numberOfPages stays at 2. The same test then switches to the Action(s)
 * tab, types into the Action field, saves, and reasserts the page count.
 *
 * Regression signal: a refactor that adds servedPartiesCode, action,
 * judge, trialLocation, or any other Service/Action(s) field to
 * shouldGenerateCoversheetForDocketEntry would land at 3 pages here.
 */
describe('Edit Docket Entry Service / Action(s) tab edits do not regenerate the coversheet', () => {
  it('keeps page count unchanged after editing Service tab fields and Action(s) tab fields', () => {
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
      // Complete QC without edits — the entry must be COMPLETE before
      // the Edit Docket Entry Meta page is available.
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid=work-item-${docketNumber}]`)
        .find(`[data-testid=work-item-document-link-${docketNumber}]`)
        .click();
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      goToCase(docketNumber);
      assertDocketEntryPageCount({ eventCode: 'EXH', expected: '2' });

      // Resolve the EXH entry's index from its docket-entry-eventCode
      // cell — `data-testid="docket-entry-eventCode-<index>"`.
      cy.get('[data-testid^="docket-entry-eventCode-"]')
        .filter((_, el) => /\bEXH\b/.test(el.textContent || ''))
        .invoke('attr', 'data-testid')
        .then(cellTestId => {
          const match = (cellTestId || '').match(/docket-entry-eventCode-(\d+)/);
          if (!match) {
            throw new Error(
              `Could not resolve EXH docket entry index from data-testid: ${cellTestId}`,
            );
          }
          const docketRecordIndex = match[1];

          // Edit Service tab: flip servedPartiesCode to a different option.
          cy.visit(
            `/case-detail/${docketNumber}/docket-entry/${docketRecordIndex}/edit-meta`,
          );
          cy.get('#tab-service').click();
          cy.get('#served-parties-r').check({ force: true });
          cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');

          // Page count must not have changed — Service tab edits don't
          // regenerate the coversheet.
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'EXH', expected: '2' });

          // Edit Action(s) tab: type into the Action text field.
          cy.visit(
            `/case-detail/${docketNumber}/docket-entry/${docketRecordIndex}/edit-meta`,
          );
          cy.get('#tab-action').click();
          cy.get('#action').type('Take some action');
          cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
          cy.get('[data-testid="loading-overlay"]').should('not.exist');

          // Page count must STILL be unchanged after the Action edit.
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'EXH', expected: '2' });
        });
    });
  });
});
