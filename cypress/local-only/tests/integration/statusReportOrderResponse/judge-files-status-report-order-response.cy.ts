import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
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
// test message flow

const today = formatNow(FORMATS.MMDDYYYY);
const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
const expectedPdfLines = [
  'On June 28, 2024, a status report was filed in this case (Index no. 5). For cause, it is',
  `ORDERED that the parties shall file a further status report by ${formattedToday}. It is further`,
  'ORDERED that this case is stricken from the trial session. It is further',
  'ORDERED that jurisdiction is retained by the undersigned. It is further',
  'ORDERED that Here is my additional order text.',
];

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

  describe('happy paths', () => {
    it('should save draft when no options are selected', () => {
      loginAsColvin();
      cy.visit('/case-detail/107-19');
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();

      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');

      // save as draft
      cy.get('[data-testid="save-draft-button"]').click();

      cy.wait('@courtIssuedOrder').then(({ request: req }) => {
        expect(req.body.contentHtml).to.include(expectedPdfLines[0]);
        expectedPdfLines.forEach((pdfLine, i) => {
          if (i > 0) {
            expect(req.body.contentHtml).to.not.include(pdfLine);
          }
        });
      });

      cy.contains('Apply Signature').should('exist');
    });

    it('should save draft when all options are selected', () => {
      loginAsColvin();
      // navigate to status report order response
      cy.visit('/case-detail/107-19');
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();

      // selecting our options
      cy.get('#order-type-status-report').check({ force: true });
      cy.get('#status-report-due-date-picker').type(today);
      cy.get('#stricken-from-trial-sessions').check({ force: true });
      cy.get('#jurisdiction-retained').check({ force: true });
      cy.get('#additional-order-text').type(
        'Here is my additional order text.',
      );
      cy.get('#docket-entry-description').clear();
      cy.get('#docket-entry-description').type('Important Order');

      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');

      // save as draft
      cy.get('[data-testid="save-draft-button"]').click();

      cy.wait('@courtIssuedOrder').then(({ request: req }) => {
        expectedPdfLines.forEach(pdfLine => {
          expect(req.body.contentHtml).to.include(pdfLine);
        });
      });

      cy.contains('Apply Signature').should('exist');
    });

    it('should save draft when order type is "Status Report or Stipulated Decision"', () => {
      const secondPdfLine = `ORDERED that the parties shall file a status report or proposed stipulated decision by ${formattedToday}`;
      loginAsColvin();

      // navigate to status report order response
      cy.visit('/case-detail/107-19');
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();

      // selecting our options
      cy.get('#order-type-or-stipulated-decision').check({ force: true });
      cy.get('#status-report-due-date-picker').type(today);

      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');

      // save as draft
      cy.get('[data-testid="save-draft-button"]').click();

      cy.wait('@courtIssuedOrder').then(({ request: req }) => {
        expect(req.body.contentHtml).to.include(expectedPdfLines[0]);
        expect(req.body.contentHtml).to.include(secondPdfLine);
        expect(req.body.contentHtml).to.not.include(expectedPdfLines[1]);
      });

      cy.contains('Apply Signature').should('exist');
    });

    it('should save draft when jurisdiction is "Restored to the general docket"', () => {
      const secondPdfLine =
        'ORDERED that this case is restored to the general docket.';

      loginAsColvin();
      // navigate to status report order response
      cy.visit('/case-detail/107-19');
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();

      // selecting our options
      cy.get('#jurisdiction-restored-to-general-docket').check({ force: true });

      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');

      // save as draft
      cy.get('[data-testid="save-draft-button"]').click();

      cy.wait('@courtIssuedOrder').then(({ request: req }) => {
        console.log(req.body.contentHtml);
        expect(req.body.contentHtml).to.include(expectedPdfLines[0]);
        expect(req.body.contentHtml).to.include(secondPdfLine);
        expect(req.body.contentHtml).to.not.include(expectedPdfLines[3]);
      });

      cy.contains('Apply Signature').should('exist');
    });

    it.skip(
      'should save draft with all case docket numbers on PDF when issue order is "All cases in this group"',
    );

    it.skip(
      'should save draft with just lead case docket number on PDF when issue order is "Just this case"',
    );
  });
});
