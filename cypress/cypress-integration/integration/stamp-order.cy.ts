import { petitionerCreatesACase } from '../support/setup/petitioner-creates-a-case';
import { petitionsClerkServesPetition } from '../support/setup/petitionsclerk-serves-petition';

describe('Judge`s chambers stamps an order', () => {
  it('should create an order, serve it, and apply a stamp to it', () => {
    petitionerCreatesACase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      cy.login('docketclerk1', `case-detail/${docketNumber}`);
      cy.getByTestId('create-dropdown').click();
      cy.getByTestId('menu-button-add-paper-filing').click();
      cy.get('input#date-received-picker').type('11/01/2023');
      cy.get(
        '#document-type .select-react-element__input-container input',
      ).type('Motion for Continuance');
      cy.get('#react-select-2-option-0').click({ force: true });
      cy.getByTestId('filed-by-option').contains('Petitioner').click();
      cy.getByTestId('button-upload-pdf').click();
      cy.get('input#primaryDocumentFile-file').attachFile(
        '../fixtures/w3-dummy.pdf',
      );
      cy.getByTestId('remove-pdf');
      cy.getByTestId('save-and-serve').click();
      cy.getByTestId('modal-button-confirm').click();
      cy.get('.usa-alert').should(
        'contain',
        'Print and mail to complete paper service.',
      );

      cy.login('colvinschambers', `case-detail/${docketNumber}`);
      cy.getByTestId('document-viewer-link-M006').last().click();
      cy.getByTestId('apply-stamp').click();
      cy.getByTestId('status-report-or-stip-decision-due-date').click();
      cy.get('input#due-date-input-statusReportDueDate-picker').type(
        '11/02/2023',
      );
      cy.get('input#due-date-input-statusReportDueDate-picker').should(
        'have.value',
        '11/02/2023',
      );
      cy.getByTestId('clear-optional-fields').click();
      cy.getByTestId('status-report-or-stip-decision-due-date').click();
      cy.get('input#due-date-input-statusReportDueDate-picker').should(
        'have.value',
        '',
      );
    });
  });
});
