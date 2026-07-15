import { attachFile } from '../../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Story 10192 — Sealing an externally filed "Exhibit in Support" (EXS) and
 * verifying cross-user visibility at the two seal levels.
 *
 * DAWSON supports sealing a docket entry to two audiences
 * (DOCKET_ENTRY_SEALED_TO_TYPES in shared/src/business/entities/EntityConstants.ts):
 *   - PUBLIC ('Public')   -> "Seal to the public"
 *       Associated external parties (petitioner / counsel / respondent) can
 *       STILL view it; unassociated / not-signed-in / terminal users cannot.
 *   - EXTERNAL ('External') -> "Seal to the public and parties of this case"
 *       Even associated external parties cannot view it.
 * Internal court users (docket clerk here) can always view a sealed entry.
 *
 * USER-TYPE COVERAGE (kept deterministic per the story's guidance):
 *   - Docket clerk .............. internal control: always sees the doc; drives
 *                                 the seal / unseal UI.
 *   - ONE associated private
 *     practitioner (counsel) .... the associated-external-party case; this is
 *                                 the user that distinguishes PUBLIC (can view)
 *                                 from EXTERNAL (cannot view). Because the
 *                                 practitioner e-files the EXS on behalf of the
 *                                 petitioner, they are counsel of record and
 *                                 therefore an associated party.
 *   - Public / not-signed-in .... the public docket record.
 *
 *   CONSOLIDATED OUT (documented, not separately asserted, to avoid a long/flaky
 *   spec with no added coverage of the seal logic):
 *     * Public-terminal user — a docket entry sealed to the public is excluded
 *       from the PUBLIC record for every public consumer (signed-out and
 *       terminal alike), so it collapses into the not-signed-in public check.
 *     * A separate UNASSOCIATED practitioner — has strictly no more access than
 *       the public record, so the public check already covers "unassociated
 *       external user cannot view".
 *
 * NOTE on the public assertions: an Exhibit in Support is not part of the
 * publicly downloadable record by document-type policy regardless of sealing,
 * so the public checks confirm the sealed exhibit is never exposed publicly but
 * are not what isolates PUBLIC-vs-EXTERNAL. The associated-practitioner
 * assertions isolate the two seal levels.
 */
describe('Docket clerk seals / unseals an "Exhibit in Support" (EXS)', () => {
  const primaryFilerName = 'Cody';
  const exhibitTitle = 'Exhibit in Support of Petition';

  const assertPublicCannotViewExhibit = (docketNumber: string) => {
    // Not-signed-in public user looks up the (served) case on the public site.
    cy.visit('/');
    cy.get('[data-testid="docket-number"]').type(docketNumber.trim());
    cy.get('[data-testid="docket-search-button"]').click();
    cy.get('[data-testid="header-public-case-detail"]');

    // No public link to the sealed Exhibit in Support is rendered.
    cy.contains(
      '[data-testid="Filing-and-Proceedings-link-to-docket-entry"]',
      'Exhibit in Support',
    ).should('not.exist');
  };

  it('seals to the public, then to the public and parties, verifying visibility for the clerk, the associated practitioner, and the public at each step', () => {
    // ---- Precondition: a served + QC-completed EXS with an associated
    // practitioner (counsel of record for the petitioner). ----
    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      // Practitioner e-files "Exhibit in Support" as the primary document,
      // associated with the served Petition (Nonstandard A). Selecting a filing
      // party (Cody, Petitioner) is only possible because the practitioner is
      // counsel of record — i.e. an associated party.
      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();

      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Exhibit in Support',
      );

      cy.get('[data-testid="previous-document-search"]')
        .find('option')
        .then($options => {
          const petitionOption = Array.from($options).find(opt =>
            opt.textContent?.includes('Petition'),
          );
          const optionText = petitionOption?.textContent?.trim() || '';
          cy.get('[data-testid="previous-document-search"]').select(optionText);
        });

      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get(
        `[data-testid="filingParty-${primaryFilerName}, Petitioner"]`,
      ).click();
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Docket clerk QC-completes the EXS so it is a served + QC-completed entry.
      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid=work-item-${docketNumber}]`)
        .should('contain', exhibitTitle)
        .find(`[data-testid=work-item-document-link-${docketNumber}]`)
        .click();
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // ---- Step 1: Clerk opens the Docket Record; can view the exhibit and
      // sees the Seal button on its row. ----
      goToCase(docketNumber);
      cy.get('[data-testid="docket-record-table"]');
      cy.get('[data-testid="document-viewer-link-EXS"]').should(
        'contain',
        exhibitTitle,
      );
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .should('contain', 'Seal');

      // ---- Step 2: Clerk seals the exhibit "to the public". ----
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .click();
      cy.get('[data-testid="seal-docket-entry-modal"]');
      // Radio option DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC ('Public').
      cy.get('#docket-entry-sealed-to-public').click(); // label: "Seal to the public"
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Success: the row now shows the sealed lock indicator and the seal
      // control flips to "Unseal". The clerk still sees the document link.
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('.sealed-docket-entry')
        .should('exist');
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .should('contain', 'Unseal');
      cy.get('[data-testid="document-viewer-link-EXS"]').should('exist');

      // ---- Step 3: Visibility while sealed-to-public. ----
      // Associated practitioner (counsel) CAN still view it.
      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="docket-record-table"]');
      cy.get('[data-testid="document-download-link-EXS"]')
        .should('exist')
        .and('contain', exhibitTitle);

      // Public / not-signed-in user CANNOT view it.
      assertPublicCannotViewExhibit(docketNumber);

      // ---- Step 4: Clerk unseals it — lock icon disappears, "Seal" returns. ----
      loginAsDocketClerk();
      goToCase(docketNumber);
      cy.get('[data-testid="docket-record-table"]');
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .click();
      cy.get('[data-testid="modal-confirm"]').click(); // Unseal confirm (ConfirmModal)
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('.sealed-docket-entry')
        .should('not.exist');
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .should('contain', 'Seal');

      // ---- Step 5: Clerk seals again, "to the public and parties of this
      // case" (EXTERNAL). Even the associated practitioner cannot view it. ----
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .click();
      cy.get('[data-testid="seal-docket-entry-modal"]');
      // Radio option DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL ('External').
      cy.get('#docket-entry-sealed-to-external').click(); // label: "Seal to the public and parties of this case"
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('.sealed-docket-entry')
        .should('exist');

      // Associated practitioner CANNOT view it now (no download link), though
      // the row/description remains on the docket record.
      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="docket-record-table"]');
      cy.contains('#docket-record-table tr', exhibitTitle).should('exist');
      cy.get('[data-testid="document-download-link-EXS"]').should('not.exist');

      // Public / not-signed-in user still CANNOT view it.
      assertPublicCannotViewExhibit(docketNumber);
    });
  });
});
