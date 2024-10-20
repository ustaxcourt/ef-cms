import { attachFile } from '../../../../../../helpers/file/upload-file';
import { loginAsPetitioner } from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCaseWithSpouse } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Judge`s chambers stamps an order', () => {
  it('should create an order, serve it, and apply a stamp to it', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCaseWithSpouse().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      cy.login('docketclerk1', `case-detail/${docketNumber}`);

      // File Motion for Continuance
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-paper-filing"]').click();
      cy.get('input#date-received-picker').type('11/01/2023');
      selectTypeaheadInput(
        'primary-document-type-search',
        'Motion for Continuance',
      );
      cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();
      cy.get('[data-testid="upload-pdf-button"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: 'input#primaryDocumentFile-file',
        selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
      });
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('.usa-alert').should(
        'contain',
        'Print and mail to complete paper service.',
      );

      // Apply a stamp
      cy.login('colvinschambers', `case-detail/${docketNumber}`);
      cy.get('[data-testid="document-viewer-link-M006"]').last().click();
      cy.get('[data-testid="apply-stamp"]').click();
      cy.get('[data-testid="status-report-or-stip-decision-due-date"]').click();
      cy.get('input#due-date-input-statusReportDueDate-picker').type(
        '11/02/2023',
      );
      cy.get('input#due-date-input-statusReportDueDate-picker').should(
        'have.value',
        '11/02/2023',
      );
      cy.get('[data-testid="clear-optional-fields"]').click();
      cy.get('[data-testid="status-report-or-stip-decision-due-date"]').click();
      cy.get('input#due-date-input-statusReportDueDate-picker').should(
        'have.value',
        '',
      );

      // Apply stamp
      cy.get('[data-testid="clear-optional-fields"]').click();
      cy.get('[data-testid="motion-disposition-Granted"]').click();
      cy.get('[data-testid="save-signature-button"]').click();

      // Make sure it's there
      cy.get('[data-testid="success-alert"]').contains(
        'Motion for Continuance stamped successfully.',
      );
      cy.get('[data-testid="docket-entry-description-1"]').contains(
        'Motion for Continuance GRANTED',
      );
    });
  });
});
