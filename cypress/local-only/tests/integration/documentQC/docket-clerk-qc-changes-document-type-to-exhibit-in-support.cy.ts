import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';
import { waitForDocketEntryByEventCode } from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';

describe('Docket clerk changes a document type to "Exhibit in Support" during Document QC', () => {
  it('completes QC with the new type, writes a Notice of Docket Change, and shows the retitled EXS entry on the docket record', () => {
    const primaryFilerName = 'Cody';
    const today = formatNow(FORMATS.MMDDYY);

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

      selectTypeaheadInput(
        'primary-document-type-search',
        'Exhibit in Support',
      );

      cy.contains('Which document is this exhibit in support of?').should(
        'exist',
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
      cy.get('[data-testid="previous-document-search"]')
        .find('option:selected')
        .should('contain', 'Petition');

      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      cy.get('[data-testid="success-alert"]')
        .should('contain', 'QC Completed')
        .and('contain', 'has been completed.');
      cy.get(`[data-testid=work-item-${docketNumber}]`).should('not.exist');

      waitForDocketEntryByEventCode({ docketNumber, eventCode: 'NODC' });

      goToCase(docketNumber);
      cy.get('[data-testid="document-viewer-link-EXS"]').contains(
        'Exhibit in Support of Petition',
      );

      cy.contains('#docket-record-table tr', 'Exhibit in Support of Petition')
        .should('contain', 'EXS')
        .and('contain', today)
        .and('contain', primaryFilerName);

      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'NODC').should(
        'exist',
      );

      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-viewer-link-EXS"]').should('exist');
    });
  });
});
