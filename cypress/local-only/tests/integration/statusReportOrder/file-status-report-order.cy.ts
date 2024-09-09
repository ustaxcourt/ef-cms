import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  docketNumber,
  expectedPdfLines,
  getLastDraftOrderElementIndexFromDrafts,
  leadCaseDocketNumber,
  selectAllOptionsInForm,
} from '../../../support/statusReportOrder';
import {
  loginAsAdc,
  loginAsColvin,
  loginAsColvinChambers,
} from '../../../../helpers/authentication/login-as-helpers';
import { retry } from '../../../../helpers/retry';

describe('file status report order', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
  const firstPdfLineJustThisCase =
    'On June 28, 2024, a status report was filed (Document no.';
  const firstPdfLineForAllCasesInGroup =
    'On June 28, 2024, a status report was filed (Lead case document no.';

  describe('judge', () => {
    beforeEach(() => {
      loginAsColvin();
    });

    describe('pdf preview', () => {
      it('should show a pdf preview when clicking preview pdf', () => {
        cy.visit(`/case-detail/${docketNumber}`);
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="status-report-order-button"]').click();

        cy.get('[data-testid="preview-pdf-button"]').click();

        // Expect pdf wrapper to contain preview content
        retry(() => {
          return cy.get('body').then(body => {
            /** Assert */
            return (
              body.find('#status-report-order-pdf-preview').children.length > 1
            );
          });
        });
      });
    });

    describe('filing a status report order from document view', () => {
      it('should save unsigned draft when no options are selected', () => {
        cy.visit(`/case-detail/${docketNumber}`);
        cy.get('#tab-document-view').click();
        const lastOrderIndex = getLastDraftOrderElementIndexFromDrafts();
        cy.contains('Status Report').click();
        cy.get('[data-testid="status-report-order-button"]').click();

        cy.get('#jurisdiction-retained').should('be.disabled');
        cy.get('#jurisdiction-restored-to-general-docket').should(
          'be.disabled',
        );

        // We check that no options are selected when the user
        // selects a jurisdiction but then unchecks case stricken
        cy.get('#stricken-from-trial-sessions').check({ force: true });
        cy.get('#jurisdiction-retained').check({ force: true });
        cy.get('#stricken-from-trial-sessions').uncheck({ force: true });

        cy.get('#jurisdiction-retained').should('be.disabled');
        cy.get('#jurisdiction-restored-to-general-docket').should(
          'be.disabled',
        );

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
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

        cy.get('[data-testid="sign-pdf-canvas"]').click();
        cy.get('[data-testid="save-signature-button"]').click();
        cy.get('#tab-drafts').click();

        // Check that we made a new order draft
        expect(lastOrderIndex).to.not.equal(
          getLastDraftOrderElementIndexFromDrafts(),
        );
      });

      it('should save signed draft when all options are selected', () => {
        cy.visit(`/case-detail/${docketNumber}`);
        cy.get('#tab-document-view').click();
        const lastOrderIndex = getLastDraftOrderElementIndexFromDrafts();
        cy.contains('Status Report').click();
        cy.get('[data-testid="status-report-order-button"]').click();
        selectAllOptionsInForm();

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expectedPdfLines.forEach(pdfLine => {
            expect(req.body.contentHtml).to.include(pdfLine);
          });
        });

        cy.contains('Apply Signature').should('exist');

        cy.get('[data-testid="skip-signature-button"]').click();
        cy.get('#tab-drafts').click();

        // Check that we made a new order draft
        expect(lastOrderIndex).to.not.equal(
          getLastDraftOrderElementIndexFromDrafts(),
        );
      });

      it('should save draft when order type is "Status Report or Stipulated Decision"', () => {
        const secondPdfLine = `ORDERED that the parties shall file a status report or proposed stipulated decision by ${formattedToday}`;

        cy.visit(`/case-detail/${docketNumber}`);
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="status-report-order-button"]').click();
        cy.get('#order-type-or-stipulated-decision').check({ force: true });
        cy.get('#status-report-due-date-picker').type(today);

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
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

        cy.visit(`/case-detail/${docketNumber}`);
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="status-report-order-button"]').click();
        cy.get('#jurisdiction-restored-to-general-docket').check({
          force: true,
        });

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.contentHtml).to.include(expectedPdfLines[0]);
          expect(req.body.contentHtml).to.include(secondPdfLine);
          expect(req.body.contentHtml).to.not.include(expectedPdfLines[3]);
        });
        cy.contains('Apply Signature').should('exist');
      });

      it('should save draft with all case docket numbers on PDF when issue order is "All cases in this group"', () => {
        cy.visit(`/case-detail/${leadCaseDocketNumber}`);
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="status-report-order-button"]').click();

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.addedDocketNumbers).to.include.members([
            '102-67',
            '103-67',
            '104-67',
            '105-67',
          ]);
          expect(req.body.contentHtml).to.include(
            firstPdfLineForAllCasesInGroup,
          );
          expect(req.body.contentHtml).not.to.include(firstPdfLineJustThisCase);
        });
        cy.contains('Apply Signature').should('exist');
      });

      it('should save draft with just lead case docket number on PDF when issue order is "Just this case"', () => {
        cy.visit(`/case-detail/${leadCaseDocketNumber}`);
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="status-report-order-button"]').click();
        cy.get('#just-this-case').click({ force: true });

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.addedDocketNumbers).to.be.empty;
          expect(req.body.contentHtml).to.include(firstPdfLineJustThisCase);
          expect(req.body.contentHtml).not.to.include(
            firstPdfLineForAllCasesInGroup,
          );
        });
        cy.contains('Apply Signature').should('exist');
      });
    });

    describe('filing a status report order from message view', () => {
      it('should be able to create signed order from messages and redirects to messages tab', () => {
        cy.visit(`/case-detail/${docketNumber}`);

        cy.get('#tab-case-messages').click();
        cy.contains('a', 'Status Report').click();
        cy.get('[data-testid="status-report-order-button"]').click();
        cy.get('[data-testid="save-draft-button"]').click();
        cy.contains('Apply Signature').should('exist');
        cy.get('[data-testid="sign-pdf-canvas"]').click();
        cy.get('[data-testid="save-signature-button"]').click();

        cy.contains('Order updated.').should('exist');
        cy.url().should('include', `messages/${docketNumber}/message-detail/`);
        cy.contains('.attachment-viewer-button', 'Order').should('exist');
      });
    });
  });

  describe('chambers', () => {
    describe('filing a status report order from document view', () => {
      it('should save draft when all options are selected', () => {
        loginAsColvinChambers();
        cy.visit(`/case-detail/${docketNumber}`);
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="status-report-order-button"]').click();
        selectAllOptionsInForm();

        cy.get('[data-testid="save-draft-button"]').click();

        cy.contains('Apply Signature').should('exist');
      });
    });
  });

  describe('adc', () => {
    describe('filing a status report order from document view', () => {
      it('should save draft when all options are selected', () => {
        loginAsAdc();
        cy.visit(`/case-detail/${docketNumber}`);
        cy.get('#tab-document-view').click();
        cy.contains('Status Report').click();
        cy.get('[data-testid="status-report-order-button"]').click();
        selectAllOptionsInForm();

        cy.get('[data-testid="save-draft-button"]').click();

        cy.contains('Apply Signature').should('exist');
      });
    });
  });
});
