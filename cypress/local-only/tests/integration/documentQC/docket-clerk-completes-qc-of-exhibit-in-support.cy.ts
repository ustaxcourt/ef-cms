import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Document QC completion for story 10192: a petitioner e-files an "Exhibit in
 * Support" (EXS) as the primary document, associated with the served Petition.
 * A docket clerk picks the work item up in Section Document QC, opens it, and
 * clicks Complete without changing anything. Because neither the type nor the
 * title changes, no Notice of Docket Change is written — completing QC simply
 * clears the work item and surfaces the "QC Completed" message.
 *
 * The seeded case has an electronic petitioner (no paper-service parties), so
 * the print-for-paper-service screen does not apply here.
 */
describe('Docket clerk completes Document QC of an externally filed "Exhibit in Support"', () => {
  it('finds the EXS work item in Section Document QC, completes it, and shows the completed EXS entry on the docket record', () => {
    const primaryFilerName = 'Cody';
    const today = formatNow(FORMATS.MMDDYY);

    // Petitioner e-files "Exhibit in Support" as the primary document,
    // associated with the served Petition (title becomes "Exhibit in Support
    // of Petition").
    loginAsPetitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsPetitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();

      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Exhibit in Support',
      );

      // Nonstandard A: identify the associated docketed filing (the Petition).
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
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Step 1-2: Docket clerk is routed to the dashboard, then navigates to
      // Document QC -> Section Document QC. The externally filed Exhibit in
      // Support surfaces as a work item for this case.
      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid=work-item-${docketNumber}]`)
        .should('contain', 'Exhibit in Support of Petition')
        .find(`[data-testid=work-item-document-link-${docketNumber}]`)
        .click();

      // Step 3: The Document QC page for the Exhibit in Support opens with the
      // type and association already populated from the petitioner's filing.
      cy.get('[data-testid="save-and-finish-document-qc"]').should('exist');
      cy.get('[data-testid="previous-document-search"]')
        .find('option:selected')
        .should('contain', 'Petition');

      // Step 4: Click Complete.
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Routed back to My Document QC with the "QC Completed" banner
      // ("Exhibit in Support of Petition has been completed.") and the work
      // item cleared from the inbox.
      cy.get('[data-testid="success-alert"]')
        .should('contain', 'QC Completed')
        .and('contain', 'Exhibit in Support of Petition has been completed.');
      cy.get(`[data-testid=work-item-${docketNumber}]`).should('not.exist');

      // Step 5: Case detail docket record shows the Exhibit in Support entry
      // under event code EXS, titled after the associated document.
      goToCase(docketNumber);
      cy.get('[data-testid="document-viewer-link-EXS"]').contains(
        'Exhibit in Support of Petition',
      );

      // The EXS row shows the event code, today's filed/served date, and the
      // petitioner as Filed By.
      cy.contains('#docket-record-table tr', 'Exhibit in Support of Petition')
        .should('contain', 'EXS')
        .and('contain', today)
        .and('contain', primaryFilerName);

      // Exhibit in Support docs display when filtered to show "Exhibits".
      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-viewer-link-EXS"]').should('exist');
    });
  });
});
