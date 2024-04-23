import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../helpers/auth/login-as-helpers';
import { logout } from '../../helpers/auth/logout';
import { petitionerCreatesElectronicCase } from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../helpers/petitionsclerk-serves-petition';

/**
 * Given a case
 * When a docket clerk adds a paper filing that is not valid and attempts to serve it
 * Then they should see a validation error message
 */
describe('Docket clerk adding a paper filing', () => {
  it('should be alerted when the paper filing is not valid when they attempt to serve', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
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
});

/**
 * Given a case
 * When a docket clerk QCs a paper filing, changing the event code
 * Then they should see the document title was updated
 */
describe('Docket clerk QC-ing a paper filing', () => {
  it('should see the document title was updated when they change the event code while QC-ing', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk1();
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);

      cy.get('[data-testid="search-docket-number"]').click();
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-paper-filing"]').click();
      cy.get('[data-testid="save-for-later"]').click();

      cy.get('[data-testid="error-alert"]')
        .should('contain', 'Enter a valid date received')
        .and('contain', 'Select a filing party')
        .and('contain', 'Select a document type');

      cy.get(
        '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
      ).click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
      ).type('01/01/2018');

      cy.get('[data-testid="primary-document-type-search"]').type('M115');
      cy.get('#react-select-2-option-0').click();

      cy.get('[data-testid="secondary-document-type-search"]').type('APPW');
      cy.get('#react-select-3-option-0').click();

      cy.get('[data-testid="additional-info-1-textarea"]').type(
        'Test Secondary Additional Info',
      );

      cy.get('[data-testid="add-to-coversheet-checkbox"]').click();

      cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();

      cy.get('[data-testid="objections-No"').click();

      cy.get('[data-testid="upload-pdf-button"]').click();
      cy.get('input#primaryDocumentFile-file').attachFile(
        '../fixtures/w3-dummy.pdf',
      );

      cy.get('[data-testid="save-for-later"]').click();
      cy.get('[data-testid="success-alert"]').contains(
        'Your entry has been added to the docket record.',
      );

      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get(
        '[data-testid="individual-work-queue-in-progress-button"]',
      ).click();
      cy.get(
        `[data-testid="${docketNumber}-qc-item-row"] [data-testid="qc-link"]`,
      ).click();

      cy.get('#react-select-5-input').type('A');
      cy.get('#react-select-5-option-0').click();
      cy.get('[data-testid="save-and-serve"]').click();

      cy.get('[data-testid="modal-dialog"]').contains(
        'Motion for Leave to File Answer',
      );
    });
  });
});
