import { externalUserCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { attachFile } from 'cypress/helpers/file/upload-file';

/**
 * Given a case
 * When a docket clerk adds a paper filing that is not valid and attempts to serve it
 * Then they should see a validation error message
 */
describe('Docket clerk adding a paper filing', () => {
  it('should be alerted when the paper filing is not valid when they attempt to serve', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk1();
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
    });

    cy.get('[data-testid="search-docket-number"]').click();
    cy.get('[data-testid="case-detail-menu-button"]').click();
    cy.get('[data-testid="menu-button-add-paper-filing"]').click();
    cy.get('[data-testid="save-and-serve"]').click();
    cy.get('[data-testid="error-alert"]').contains(
      'Please correct the following errors on the page',
    );
  });
  it('should set title properly for a notice', () => {
    const title = 'this is a title';
    const additionalInfo1 = 'add1';
    const additionalInfo2 = 'add2';
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-paper-filing"]').click();

      cy.get(
        '[data-testid="primary-document-type-search"] .select-react-element__input',
      ).type('Notice');
      cy.get('.select-react-element__option')
        .contains(/^Notice$/)
        .click();

      cy.get('input#date-received-picker').type('11/01/2023');
      cy.get('input#free-text').type(title);
      cy.get('[data-testid="additional-info-1-textarea"]').type(
        additionalInfo1,
      );
      cy.get('[data-testid="additional-info-2-textarea"]').type(
        additionalInfo2,
      );
      cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();
      cy.get('[data-testid="upload-pdf-button"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: 'input#primaryDocumentFile-file',
        selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
      });
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="confirm-modal-document-title"]').contains(
        `Notice ${title}`,
      );
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="document-viewer-link-NOT"]').contains(
        `Notice ${title} ${additionalInfo1} ${additionalInfo2}`,
      );
    });
  });
});
