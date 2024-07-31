import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  docketNumber,
  expectedPdfLines,
  messages,
  selectAllOptionsInForm,
  statusReportDocketEntryId,
} from '../../../support/statusReportOrder';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';
import { v4 } from 'uuid';

describe('edit status report order', () => {
  beforeEach(() => {
    loginAsColvin();
    cy.visit(`/case-detail/${docketNumber}`);
  });

  describe('editing a status report order from drafts document view', () => {
    it('should load existing unsigned order', () => {
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('#tab-drafts').click();
      cy.contains(
        'button',
        messages.testStatusReportOrderUnsigned.name,
      ).click();
      cy.get('[data-testid="draft-edit-button-not-signed"]').click();

      cy.get('[data-testid="status-report-order-pdf-preview"]').should(
        'not.be.empty',
      );

      cy.get('#order-type-status-report').should('be.checked');
      // expect either the seeded data's date or else the updated date we set in these tests
      cy.get('#status-report-due-date-picker').should($el => {
        expect($el.val()).to.satisfy(
          (t: string | string[]) =>
            t.includes('07/11/2024') ||
            t.includes(`${formatNow(FORMATS.MMDDYYYY)}`),
        );
      });
      cy.get('#stricken-from-trial-sessions').should('be.checked');
      cy.get('#jurisdiction-retained').should('be.checked');
      cy.get('#additional-order-text').should('contain', 'Test');
      cy.get('#docket-entry-description').should(
        'contain',
        'Test Status Report Order (Unsigned)',
      );
    });

    it('should load existing signed order', () => {
      cy.get('#tab-drafts').click();
      cy.contains('button', messages.testStatusReportOrderSigned.name).click();
      cy.get('[data-testid="edit-order-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="status-report-order-pdf-preview"]').should(
        'not.be.empty',
      );

      cy.get('#order-type-status-report').should('be.checked');
      cy.get('#status-report-due-date-picker').invoke('val').should('exist');
      cy.get('#stricken-from-trial-sessions').should('be.checked');
      cy.get('#jurisdiction-retained').should('be.checked');
      cy.get('#additional-order-text').should('contain', 'Test');
      cy.get('#docket-entry-description').should(
        'contain',
        'Test Status Report Order (Signed)',
      );

      cy.get('#status-report-due-date-picker').clear();
      cy.get('#status-report-due-date-picker').type(
        formatNow(FORMATS.MMDDYYYY),
      );
      cy.get('[data-testid="save-draft-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
    });

    it('should be able to save edited status report order without duplicates', () => {
      const orderName = `Order ${v4()}`;
      const revisedOrderName = `Order ${v4()}`;
      cy.get('#tab-document-view').click();
      cy.get(`[data-entry-id="${statusReportDocketEntryId}"]`).click();
      cy.get('[data-testid="status-report-order-button"]').click();
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
          if (i === 2 || i === 3) {
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

  describe('editing a status report order from message view', () => {
    it('should load existing unsigned order', () => {
      cy.get('#tab-case-messages').click();
      cy.contains('a', messages.testStatusReportOrderUnsigned.name).click();
      cy.get('[data-testid="edit-unsigned-document-button"]').click();

      cy.get('[data-testid="status-report-order-pdf-preview"]').should(
        'not.be.empty',
      );

      cy.get('#order-type-status-report').should('be.checked');
      // expect either the seeded data's date or else the updated date we set in these tests
      cy.get('#status-report-due-date-picker').should($el => {
        expect($el.val()).to.satisfy(
          (t: string | string[]) =>
            t.includes('07/11/2024') ||
            t.includes(`${formatNow(FORMATS.MMDDYYYY)}`),
        );
      });
      cy.get('#stricken-from-trial-sessions').should('be.checked');
      cy.get('#jurisdiction-retained').should('be.checked');
      cy.get('#additional-order-text').should('contain', 'Test');
      cy.get('#docket-entry-description').should(
        'contain',
        'Test Status Report Order (Unsigned)',
      );
    });

    it('should load existing signed order', () => {
      cy.get('#tab-case-messages').click();
      cy.contains('a', messages.testStatusReportOrderSigned.name).click();
      cy.get('[data-testid="edit-signed-document-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="status-report-order-pdf-preview"]').should(
        'not.be.empty',
      );

      cy.get('#order-type-status-report').should('be.checked');
      cy.get('#status-report-due-date-picker').invoke('val').should('exist');
      cy.get('#stricken-from-trial-sessions').should('be.checked');
      cy.get('#jurisdiction-retained').should('be.checked');
      cy.get('#additional-order-text').should('contain', 'Test');
      cy.get('#docket-entry-description').should(
        'contain',
        'Test Status Report Order (Signed)',
      );

      cy.get('#status-report-due-date-picker').clear();
      cy.get('#status-report-due-date-picker').type(
        formatNow(FORMATS.MMDDYYYY),
      );
      cy.get('[data-testid="save-draft-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
    });

    it('should redirect to messages tab upon saving signed status report order', () => {
      cy.get('#tab-case-messages').click();
      cy.contains('a', messages.testStatusReportOrderSigned.name).click();
      cy.get('[data-testid="edit-signed-document-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="save-draft-button"]').click();

      cy.contains('Apply Signature').should('exist');

      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();

      cy.url().should('contain', `messages/${docketNumber}/message-detail`);
    });

    it('should redirect to messages tab upon saving unsigned status report order', () => {
      cy.get('#tab-case-messages').click();
      cy.contains('a', messages.testStatusReportOrderUnsigned.name).click();
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
