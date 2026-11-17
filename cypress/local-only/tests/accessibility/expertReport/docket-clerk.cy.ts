import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';
import { checkA11y } from '../../../support/generalCommands/checkA11y';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Expert Report - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues on the docket record after paper filing an Expert Report', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsDocketClerk1();
      goToCase(docketNumber);

      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-paper-filing"]').click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
      ).type('11/01/2026');
      selectTypeaheadInput('primary-document-type-search', 'Expert Report');
      cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();
      cy.get('[data-testid="upload-pdf-button"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: 'input#primaryDocumentFile-file',
        selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
      });
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="confirm-modal-document-title"]').should(
        'contain',
        'Expert Report',
      );
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="success-alert"]').should('be.visible');

      goToCase(docketNumber);
      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'RTP')
        .parents('tr')
        .find('[data-testid^="docket-entry-filingsAndProceedings-"]')
        .should('contain', 'Expert Report');

      checkA11y();
    });
  });
});
