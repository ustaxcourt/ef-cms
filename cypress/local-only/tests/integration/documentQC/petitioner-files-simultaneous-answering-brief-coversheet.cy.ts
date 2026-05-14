import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { externalUserSearchesDocketNumber } from '../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * sample.pdf is 1 page. The queued coversheet path adds a single coversheet
 * during the petitioner-side upload (numberOfPages = 2). Simultaneous Brief
 * types are NOT auto-served, so the entry lands in the section Document QC
 * for a docket clerk to complete and then serve from the docket record.
 *
 * On serve, serveExternallyFiledDocumentInteractor bypasses the addCoversheet
 * idempotency gate for Simultaneous-brief types and stacks a SECOND
 * service-stamped coversheet on top of the file-time coversheet, so the
 * served PDF lands at numberOfPages = 3.
 */
describe('Petitioner files a Simultaneous Answering Brief', () => {
  it('adds 1 coversheet on filing and a 2nd coversheet on serve', () => {
    const primaryFilerName = 'Cody';

    loginAsPetitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      // Petitioner files a Simultaneous Answering Brief electronically.
      loginAsPetitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Simultaneous Answering Brief',
      );
      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('#submit-document').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('#submit-document').click();
      // Petitioners cannot view their own SIAB on the docket record until it
      // is served, so verify the success alert and case detail page instead.
      cy.showsSuccessMessage(true);
      cy.get('[data-testid="docket-record-table"]').should('exist');

      // Docket Clerk picks up the SIAB from section Document QC and verifies
      // the document already has 1 coversheet (sample.pdf 1 page + 1 = 2).
      loginAsDocketClerk();
      goToCase(docketNumber);
      cy.contains(
        '[data-testid^="docket-entry-eventCode-"]',
        'SIAB',
      )
        .parents('tr')
        .find('.number-of-pages')
        .should('have.text', '2');

      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid=work-item-${docketNumber}]`)
        .find(`[data-testid=work-item-document-link-${docketNumber}]`)
        .click();

      // Complete QC (does NOT serve — Simultaneous Briefs are not auto-served).
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Docket Clerk navigates to the case's docket record and serves the SIAB.
      goToCase(docketNumber);
      cy.get('[data-testid="document-viewer-link-SIAB"]').click();
      cy.get('[data-testid="serve-paper-filed-document"]').click();
      cy.get('[data-testid="confirm-initiate-service-modal"]').should('exist');
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // After serving, serveExternallyFiledDocument bypasses the
      // addCoversheet idempotency gate for Simultaneous-brief types and
      // prepends a 2nd service-stamped coversheet on top of the file-time
      // coversheet, so numberOfPages = 3 (sample 1 page + 2 coversheets).
      goToCase(docketNumber);
      cy.contains(
        '[data-testid^="docket-entry-eventCode-"]',
        'SIAB',
      )
        .parents('tr')
        .find('.number-of-pages')
        .should('have.text', '3');
      cy.contains(
        '[data-testid^="docket-entry-eventCode-"]',
        'SIAB',
      )
        .parents('tr')
        .find('[data-testid^="docket-entry-servedPartiesCode-"]')
        .should('not.be.empty');
    });
  });
});
