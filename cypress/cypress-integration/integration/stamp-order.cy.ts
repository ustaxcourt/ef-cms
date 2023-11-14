import { petitionerCreatesACase } from '../support/setup/petitioner-creates-a-case';
import { petitionsClerkServesPetition } from '../support/setup/petitionsclerk-serves-petition';

describe('Judge`s chambers stamps an order', () => {
  it('should create an order, serve it, and apply a stamp to it', () => {
    petitionerCreatesACase();
    petitionsClerkServesPetition();

    cy.get('@docketNumber').then(docketNumber => {
      cy.login('docketclerk1', `case-detail/${docketNumber}`);
    });
    cy.get('[data-testid="create-dropdown"]').click();
    cy.get('[data-testid="menu-button-add-paper-filing"').click();

    cy.get('input#date-received-picker').type('11/01/2023');
    cy.get('#document-type .select-react-element__input-container input').type(
      'Motion for Continuance',
    );
    cy.get('#react-select-2-option-0').click({ force: true });
    cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();

    cy.get('#upload-mode-upload').click();
    cy.get('input#primaryDocumentFile-file').attachFile(
      '../fixtures/w3-dummy.pdf',
    );

    cy.get('[data-testid="remove-pdf"]');

    cy.get('[data-testid="save-and-serve"]').click();

    cy.get('[data-testid="confirm"]').click();

    cy.get('.usa-alert').should(
      'contain',
      'Print and mail to complete paper service.',
    );

    cy.get('@docketNumber').then(docketNumber => {
      cy.login('colvinschambers', `case-detail/${docketNumber}`);
    });

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
  });
});
