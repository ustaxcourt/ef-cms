import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  docketNumber,
  expectedPdfLines,
  messages,
  selectAllOptionsInForm,
} from '../../../support/statusReportOrderResponse';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';
import { v4 } from 'uuid';

describe('edit status report order response', () => {
  beforeEach(() => {
    loginAsColvin();
    cy.visit(`/case-detail/${docketNumber}`);
  });

  describe('editing a status report order response from drafts document view', () => {
    it('should load existing unsigned order response', () => {
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('#tab-drafts').click();
      cy.contains('button', messages.testOrderResponseUnsigned.name).click();
      cy.get('[data-testid="draft-edit-button-not-signed"]').click();

      cy.get('[data-testid="status-report-order-response-pdf-preview"]').should(
        'not.be.empty',
      );

      cy.get('#order-type-status-report').should('be.checked');
      cy.get('#status-report-due-date-picker')
        .invoke('val')
        .should('contain', '07/11/2024');
      cy.get('#stricken-from-trial-sessions').should('be.checked');
      cy.get('#jurisdiction-retained').should('be.checked');
      cy.get('#additional-order-text').should('contain', 'Test');
      cy.get('#docket-entry-description').should(
        'contain',
        'Test Order Response (Unsigned)',
      );
    });

    it('should load existing signed order response', () => {
      cy.get('#tab-drafts').click();
      cy.contains('button', messages.testOrderResponseSigned.name).click();
      cy.get('[data-testid="edit-order-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="status-report-order-response-pdf-preview"]').should(
        'not.be.empty',
      );

      cy.get('#order-type-status-report').should('be.checked');
      cy.get('#status-report-due-date-picker').invoke('val').should('exist');
      cy.get('#stricken-from-trial-sessions').should('be.checked');
      cy.get('#jurisdiction-retained').should('be.checked');
      cy.get('#additional-order-text').should('contain', 'Test');
      cy.get('#docket-entry-description').should(
        'contain',
        'Test Order Response (Signed)',
      );

      cy.get('#status-report-due-date-picker').clear();
      cy.get('#status-report-due-date-picker').type(
        formatNow(FORMATS.MMDDYYYY),
      );
      cy.get('[data-testid="save-draft-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
    });

    it('should be able to save edited status report order response without duplicates', () => {
      const orderName = `Order ${v4()}`;
      const revisedOrderName = `Order ${v4()}`;
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="order-response-button"]').click();
      selectAllOptionsInForm({ orderName });
      cy.get('[data-testid="save-draft-button"]').click();
      cy.contains('Apply Signature').should('exist');
      cy.get('[data-testid="skip-signature-button"]').click();

      cy.get('#tab-drafts').click();
      cy.contains('button', orderName).click();
      cy.get('[data-testid="draft-edit-button-not-signed"]').click();
      cy.get('#stricken-from-trial-sessions').uncheck({ force: true });
      cy.get('#docket-entry-description').clear();
      cy.get('#docket-entry-description').type(revisedOrderName);

      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
      cy.get('[data-testid="save-draft-button"]').click();

      cy.wait('@courtIssuedOrder').then(({ request: req }) => {
        expectedPdfLines.forEach((pdfLine, i) => {
          if (i === 2) {
            expect(req.body.contentHtml).to.not.include(pdfLine);
          } else {
            expect(req.body.contentHtml).to.include(pdfLine);
          }
        });
      });
      cy.contains('Apply Signature').should('exist');

      cy.get('[data-testid="skip-signature-button"]').click();
      cy.get('#tab-drafts').click();

      cy.contains('button', orderName).should('not.exist');
      cy.contains('button', revisedOrderName).should('exist');
    });
  });

  describe('editing a status report order response from message view', () => {
    it('should load existing unsigned order response', () => {
      cy.get('#tab-case-messages').click();
      cy.contains('a', messages.testOrderResponseUnsigned.name).click();
      cy.get('[data-testid="edit-unsigned-document-button"]').click();

      cy.get('[data-testid="status-report-order-response-pdf-preview"]').should(
        'not.be.empty',
      );

      cy.get('#order-type-status-report').should('be.checked');
      cy.get('#status-report-due-date-picker')
        .invoke('val')
        .should('contain', '07/11/2024');
      cy.get('#stricken-from-trial-sessions').should('be.checked');
      cy.get('#jurisdiction-retained').should('be.checked');
      cy.get('#additional-order-text').should('contain', 'Test');
      cy.get('#docket-entry-description').should(
        'contain',
        'Test Order Response (Unsigned)',
      );
    });

    it('should load existing signed order response', () => {
      cy.get('#tab-case-messages').click();
      cy.contains('a', messages.testOrderResponseSigned.name).click();
      cy.get('[data-testid="edit-signed-document-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="status-report-order-response-pdf-preview"]').should(
        'not.be.empty',
      );

      cy.get('#order-type-status-report').should('be.checked');
      cy.get('#status-report-due-date-picker').invoke('val').should('exist');
      cy.get('#stricken-from-trial-sessions').should('be.checked');
      cy.get('#jurisdiction-retained').should('be.checked');
      cy.get('#additional-order-text').should('contain', 'Test');
      cy.get('#docket-entry-description').should(
        'contain',
        'Test Order Response (Signed)',
      );

      cy.get('#status-report-due-date-picker').clear();
      cy.get('#status-report-due-date-picker').type(
        formatNow(FORMATS.MMDDYYYY),
      );
      cy.get('[data-testid="save-draft-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
    });

    it('should redirect to messages tab upon saving signed status report order response', () => {
      cy.get('#tab-case-messages').click();
      cy.contains('a', messages.testOrderResponseSigned.name).click();
      cy.get('[data-testid="edit-signed-document-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="save-draft-button"]').click();

      cy.contains('Apply Signature').should('exist');

      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();

      cy.url().should('contain', `messages/${docketNumber}/message-detail`);
    });

    it('should redirect to messages tab upon saving unsigned status report order response', () => {
      cy.get('#tab-case-messages').click();
      cy.contains('a', messages.testOrderResponseUnsigned.name).click();
      cy.get('[data-testid="edit-unsigned-document-button"]').click();

      // Update date to pass validation on save
      cy.get('#status-report-due-date-picker').clear();
      cy.get('#status-report-due-date-picker').type(
        formatNow(FORMATS.MMDDYYYY),
      );

      cy.get('[data-testid="save-draft-button"]').click();

      cy.contains('Apply Signature').should('exist');

      cy.get('[data-testid="skip-signature-button"]').click();

      cy.url().should('contain', `messages/${docketNumber}/message-detail`);
    });
  });
});
