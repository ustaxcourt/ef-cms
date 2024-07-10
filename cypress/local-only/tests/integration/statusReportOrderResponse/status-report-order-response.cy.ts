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

const docketNumber = '107-19';
const leadCaseDocketNumber = '102-67';
const today = formatNow(FORMATS.MMDDYYYY);
const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
const expectedPdfLines = [
  'On June 28, 2024, a status report was filed in this case (Index no. 5). For cause, it is',
  `ORDERED that the parties shall file a further status report by ${formattedToday}. It is further`,
  'ORDERED that this case is stricken from the trial session. It is further',
  'ORDERED that jurisdiction is retained by the undersigned. It is further',
  'ORDERED that Here is my additional order text.',
];

const getFakeTestOrderName = () => {
  // Use a timestamp for easier local testing (no need to refresh api between tests)
  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  return `Test Order ${timestamp}`;
};

const navigateToStatusReportOrderResponseForm = (docketNum: string) => {
  cy.visit(`/case-detail/${docketNum}`);
  cy.get('#tab-document-view').click();
  cy.contains('Status Report').click();
  cy.get('[data-testid="order-response-button"]').click();
};

const sendMessageToColvin = (
  whichDocketNumber: string,
  documentName: string,
) => {
  cy.visit(`/case-detail/${whichDocketNumber}`);
  cy.get('#case-detail-menu-button').click();
  cy.contains('button', 'Message').click();
  cy.get('[data-testid="message-to-section"]').select('chambers');
  cy.get('#chambers').select('colvinsChambers');
  cy.get('[data-testid="message-to-user-id"]').select('Judge Colvin');
  cy.get('[data-testid="message-subject"]').type('Test Message Header');
  cy.get('[data-testid="message-body"]').type('Test Message Body');
  cy.get('#document').select(documentName);
  cy.get('#confirm').click();
};

const createBlankTestOrder = (
  whichDocketNumber: string,
  orderName: string,
  sign: boolean,
) => {
  navigateToStatusReportOrderResponseForm(whichDocketNumber);
  cy.get('#docket-entry-description').clear();
  cy.get('#docket-entry-description').type(orderName);
  finishOrderDraft(sign);
};

const createOrderFromMessage = (sign: boolean) => {
  // This assumes you are looking at the relevant docket number
  cy.get('#tab-case-messages').click();
  cy.contains('a', 'Status Report').click();
  cy.get('[data-testid="order-response-button"]').click();
  finishOrderDraft(sign);
};

const editOrderFromMessage = (orderName: string, sign: boolean) => {
  // This assumes you are looking at the relevant docket number
  cy.get('#tab-case-messages').click();
  cy.contains('a', orderName).click();
  cy.get('[data-testid="edit-document-button"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
  finishOrderDraft(sign);
};

const finishOrderDraft = (sign: boolean) => {
  cy.get('[data-testid="save-draft-button"]').click();
  cy.contains('Apply Signature').should('exist');
  if (sign) {
    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();
  } else {
    cy.get('[data-testid="skip-signature-button"]').click();
  }
};

describe('Status Report Order Response', () => {
  describe('judge', () => {
    beforeEach(() => {
      loginAsColvin();
    });

    describe('pdf preview', () => {
      it('should show a pdf preview when clicking preview pdf', () => {
        navigateToStatusReportOrderResponseForm(docketNumber);

        cy.get('[data-testid="preview-pdf-button"]').click();

        cy.get(
          '[data-testid="status-report-order-response-pdf-preview"]',
        ).should('be.empty');
      });
    });

    describe('form validation', () => {
      it('should have a docket entry description', () => {
        navigateToStatusReportOrderResponseForm(docketNumber);

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
        navigateToStatusReportOrderResponseForm(docketNumber);

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
        navigateToStatusReportOrderResponseForm(docketNumber);

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
        navigateToStatusReportOrderResponseForm(docketNumber);

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
        navigateToStatusReportOrderResponseForm(docketNumber);

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
        navigateToStatusReportOrderResponseForm(docketNumber);

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

        navigateToStatusReportOrderResponseForm(docketNumber);

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

        navigateToStatusReportOrderResponseForm(docketNumber);

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
        navigateToStatusReportOrderResponseForm(leadCaseDocketNumber);

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
        navigateToStatusReportOrderResponseForm(leadCaseDocketNumber);

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
      describe('with signature', () => {
        it('should be able to create order response from messages', () => {
          // Send a docket message that attaches the Status Report document
          sendMessageToColvin(docketNumber, '06/28/24 - Status Report');

          // Go to the sent message and create an Order Response
          createOrderFromMessage(true);

          // Check we have been redirected to the messages page
          cy.contains('Order updated.').should('exist');
          cy.url().should(
            'include',
            `messages/${docketNumber}/message-detail/`,
          );
        });

        it('should be able to edit order response from messages', () => {
          // Create an order response
          const testOrderName = getFakeTestOrderName();
          createBlankTestOrder(docketNumber, testOrderName, true);

          // Send a docket message that attaches the order response
          sendMessageToColvin(
            docketNumber,
            `${formatNow(FORMATS.MMDDYY)} - ${testOrderName}`,
          );

          // Go to the sent message and edit the Order Response
          editOrderFromMessage(testOrderName, true);

          // Check we have been redirected to the messages page
          cy.contains(`${testOrderName} updated.`).should('exist');
          cy.url().should(
            'include',
            `messages/${docketNumber}/message-detail/`,
          );
        });
      });

      describe('without signature', () => {
        it('should be able to create order response from messages', () => {
          // Send a docket message that attaches the Status Report document
          sendMessageToColvin(docketNumber, '06/28/24 - Status Report');

          // Go to the sent message and create an Order Response
          createOrderFromMessage(false);

          // Check we have been redirected to the messages page
          cy.contains('Order updated.').should('exist');
          cy.url().should(
            'include',
            `messages/${docketNumber}/message-detail/`,
          );
        });

        it('should be able to edit order response from messages', () => {
          // Create an order response
          const testOrderName = getFakeTestOrderName();
          createBlankTestOrder(docketNumber, testOrderName, true);

          // Send a docket message that attaches the order response
          sendMessageToColvin(
            docketNumber,
            `${formatNow(FORMATS.MMDDYY)} - ${testOrderName}`,
          );

          // Go to the sent message and edit the Order Response
          editOrderFromMessage(testOrderName, false);

          // Check we have been redirected to the messages page
          cy.contains(`${testOrderName} updated.`).should('exist');
          cy.url().should(
            'include',
            `messages/${docketNumber}/message-detail/`,
          );
        });
      });
    });

    describe('save status report order response to drafts', () => {
      // Shows in drafts list

      it('with signature', () => {
        const testOrderName = getFakeTestOrderName();
        createBlankTestOrder(docketNumber, testOrderName, true);
        cy.get('#tab-drafts').click();
        cy.contains('button', testOrderName).should('exist');
      });

      it('without signature', () => {
        const testOrderName = getFakeTestOrderName();
        createBlankTestOrder(docketNumber, testOrderName, false);
        cy.get('#tab-drafts').click();
        cy.contains('button', testOrderName).should('exist');
      });
    });

    describe('edit an existing status report order response', () => {
      let testOrderName = '';
      beforeEach(() => {
        testOrderName = getFakeTestOrderName();
        createBlankTestOrder(docketNumber, testOrderName, false);
      });

      // check req that generated lines match expected
      it.skip('should save modifications made to an existing status report order response', () => {});
    });
  });

  describe('docket clerk', () => {
    // act: serve it (docketclerk)!
    // assert: title comes through
    // assert: Saved to docket

    it.skip('should serve status report order response');
    it.skip(
      'should not be able to edit using status report order response form',
    );
  });

  describe('chambers', () => {
    describe('filing a status report order response from document view', () => {
      it('should save draft when all options are selected', () => {
        loginAsColvinChambers();
        navigateToStatusReportOrderResponseForm(docketNumber);

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
        navigateToStatusReportOrderResponseForm(docketNumber);

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
