// import {
//   FORMATS,
//   formatNow,
// } from '../../../../../shared/src/business/utilities/DateHandler';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

// judge/chambers/acdc
// not one of the above for permissions
// Upon save draft
// scrape
// signature
// no signature
// Shows in drafts list
// save to draft
// edit
// make sure pdf preview shows something
// scrape the pdf (at least one happy path) to see edits are saved
// serve it (docketclerk)!
// title comes through
// Saved to docket

describe('Judge files status order response', function () {
  // pdf preview (does it exist)
  describe('pdf preview', () => {
    it('should show a pdf preview when clicking preview pdf', () => {
      loginAsColvin();
      cy.visit('/case-detail/107-19');
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();
      cy.get('[data-testid="preview-pdf-button"]').click();

      cy.get('[data-testid="status-report-order-response-pdf-preview"]').should(
        'be.empty',
      );
    });
  });

  // Validation Logic (unhappy paths)
  // docket entry description exists
  // dueDate is valid
  // dueDate > minDate
  // if case stricken, must select jurisdiction
  describe('form validation', () => {
    it('should have a docket entry description', () => {
      loginAsColvin();
      cy.visit('/case-detail/107-19');
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();
      cy.get('#docket-entry-description').clear();
      cy.get('[data-testid="save-draft-button"]').click();

      cy.get('[data-testid="error-alert"]').should(
        'contain.text',
        'Enter a docket entry description',
      );
      cy.get('#docket-entry-description-form-group').should(
        'contain.text',
        'Enter a docket entry description',
      );
    });

    it('should have a valid due date', () => {
      loginAsColvin();
      cy.visit('/case-detail/107-19');
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();
      cy.get('#order-type-status-report').check({ force: true });

      cy.get('#status-report-due-date-picker').type('bb-bb-bbbb');
      cy.get('[data-testid="save-draft-button"]').click();

      cy.get('[data-testid="error-alert"]').should(
        'contain.text',
        'Enter a valid date',
      );
      cy.get('#status-report-due-date-form-group').should(
        'contain.text',
        'Enter a valid date',
      );
    });

    it('should have a due date prior to today', () => {
      loginAsColvin();
      cy.visit('/case-detail/107-19');
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();
      cy.get('#order-type-status-report').check({ force: true });

      cy.get('#status-report-due-date-picker').type('07/04/2023');
      cy.get('[data-testid="save-draft-button"]').click();

      cy.get('[data-testid="error-alert"]').should(
        'contain.text',
        'Due date cannot be prior to today. Enter a valid date.',
      );
      cy.get('#status-report-due-date-form-group').should(
        'contain.text',
        'Due date cannot be prior to today. Enter a valid date.',
      );
    });

    it('should have a jurisdiction when case is stricken from trial session', () => {
      loginAsColvin();
      cy.visit('/case-detail/107-19');
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();
      cy.get('#stricken-from-trial-sessions').check({ force: true });
      cy.get('[data-testid="save-draft-button"]').click();

      cy.get('[data-testid="error-alert"]').should(
        'contain.text',
        'Jurisdiction is required since case is stricken from the trial session',
      );
      cy.get('#jurisdiction-form-group').should(
        'contain.text',
        'Select jurisdiction',
      );
    });
  });

  // click on status report
  // file a new one
  // to enter correct date use = const today = formatNow(FORMATS.MMDDYYYY);
  // options
  // All
  // Order type branch
  // Jurisdiction branch
  // None
  // isLeadCase or not
  describe('happy paths', () => {
    it('should save draft when no options are selected', () => {
      cy.visit('/case-detail/107-19');
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();
      cy.get('[data-testid="save-draft-button"]').click();

      cy.contains('Apply Signature').should('exist');
    });
  });
});
