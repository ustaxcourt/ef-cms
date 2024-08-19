import { docketNumber } from '../../../support/statusReportOrder';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('validate status report order', () => {
  beforeEach(() => {
    loginAsColvin();
    cy.visit(`/case-detail/${docketNumber}`);
  });

  describe('form validation', () => {
    it('should have a valid due date', () => {
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="status-report-order-button"]').click();
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
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="status-report-order-button"]').click();
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
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      cy.get('[data-testid="status-report-order-button"]').click();
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
});
