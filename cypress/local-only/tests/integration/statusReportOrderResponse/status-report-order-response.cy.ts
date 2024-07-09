import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  loginAsAdc,
  loginAsColvin,
  loginAsColvinChambers,
} from '../../../../helpers/authentication/login-as-helpers';

// TODO 10102-story: cleanup test and reduce redundancy (not necessarily creating helpers but before each and consts)

const today = formatNow(FORMATS.MMDDYYYY);
const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
const expectedPdfLines = [
  'On June 28, 2024, a status report was filed in this case (Index no. 5). For cause, it is',
  `ORDERED that the parties shall file a further status report by ${formattedToday}. It is further`,
  'ORDERED that this case is stricken from the trial session. It is further',
  'ORDERED that jurisdiction is retained by the undersigned. It is further',
  'ORDERED that Here is my additional order text.',
];
// const leadCaseDocketNumber = '';
// const docketNumber = '107-19';

describe('Status Report Order Response', () => {
  describe('judge', () => {
    beforeEach(() => {
      //loginAsColvin();
    });

    describe('pdf preview', () => {
      it('should show a pdf preview when clicking preview pdf', () => {
        loginAsColvin();
        cy.visit('/case-detail/107-19');
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="order-response-button"]').click();
        cy.get('[data-testid="preview-pdf-button"]').click();

        cy.get(
          '[data-testid="status-report-order-response-pdf-preview"]',
        ).should('be.empty');
      });
    });

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

    describe('filing a status report order response from document view', () => {
      it('should save draft when no options are selected', () => {
        loginAsColvin();
        cy.visit('/case-detail/107-19');
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="order-response-button"]').click();

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

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

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

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

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

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
        cy.get('#jurisdiction-restored-to-general-docket').check({
          force: true,
        });

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

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

      it('should save draft with all case docket numbers on PDF when issue order is "All cases in this group"', () => {
        loginAsColvin();
        cy.visit('/case-detail/102-67');
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="order-response-button"]').click();

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.addedDocketNumbers).to.include.members([
            '102-67',
            '103-67',
            '104-67',
            '105-67',
          ]);
        });

        cy.contains('Apply Signature').should('exist');
      });

      it('should save draft with just lead case docket number on PDF when issue order is "Just this case"', () => {
        loginAsColvin();
        cy.visit('/case-detail/102-67');
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="order-response-button"]').click();
        cy.get('#just-this-case').click({ force: true });

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.addedDocketNumbers).to.be.empty;
        });

        cy.contains('Apply Signature').should('exist');
      });
    });

    describe('filing a status report order response from message view', () => {
      // make sure redirect back to message flow
    });

    describe('save status report order response to drafts', () => {
      // Shows in drafts list

      it('with signature').skip();

      it('without signature').skip();
    });

    describe('edit an existing status report order response', () => {
      beforeEach(() => {
        // For test setup, create beforeEach block that creates status report order response
      });

      // check req that generated lines match expected
      it(
        'should save modifications made to an existing status report order response',
      ).skip();
    });
  });

  describe('docket clerk', () => {
    // act: serve it (docketclerk)!
    // assert: title comes through
    // assert: Saved to docket

    it('should serve status report order response').skip();
    it(
      'should not be able to edit using status report order response form',
    ).skip();
  });

  describe('chambers', () => {
    describe('filing a status report order response from document view', () => {
      it('should save draft when all options are selected', () => {
        loginAsColvinChambers();
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

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expectedPdfLines.forEach(pdfLine => {
            expect(req.body.contentHtml).to.include(pdfLine);
          });
        });

        cy.contains('Apply Signature').should('exist');
      });
    });
  });

  describe('adc', () => {
    describe('filing a status report order response from document view', () => {
      it('should save draft when all options are selected', () => {
        loginAsAdc();
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

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expectedPdfLines.forEach(pdfLine => {
            expect(req.body.contentHtml).to.include(pdfLine);
          });
        });

        cy.contains('Apply Signature').should('exist');
      });
    });
  });
});
