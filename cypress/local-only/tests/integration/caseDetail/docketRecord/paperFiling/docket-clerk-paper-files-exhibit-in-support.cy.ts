import { attachFile } from 'cypress/helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Docket clerk paper-files an Exhibit in Support (EXS)', () => {
  it('should serve the paper filing and title it "Exhibit in Support of [Document Name]" with Attachments and Certificate of Service', () => {
    const today = formatNow(FORMATS.MMDDYYYY);

    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-paper-filing"]').click();

      selectTypeaheadInput(
        'primary-document-type-search',
        'Exhibit in Support',
      );

      cy.get(
        '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
      ).type(today);

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

      cy.get('#attachments').check({ force: true });
      cy.get('[data-testid="certificate-of-service-label"]').click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="service-date-picker"]',
      ).type(today);

      cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();

      cy.get('[data-testid="upload-pdf-button"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: 'input#primaryDocumentFile-file',
        selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
      });

      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="confirm-modal-document-title"]').contains(
        'Exhibit in Support of Petition',
      );
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="success-alert"]').should('exist');

      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'EXS')
        .parents('tr')
        .find('.number-of-pages')
        .should('have.text', '2');

      cy.get('[data-testid="document-viewer-link-EXS"]').contains(
        'Exhibit in Support of Petition',
      );

      cy.contains('#docket-record-table tr', 'Exhibit in Support of Petition')
        .should('contain', '(Attachment(s))')
        .and('contain', '(C/S');

      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-viewer-link-EXS"]').should('exist');
    });
  });
});
