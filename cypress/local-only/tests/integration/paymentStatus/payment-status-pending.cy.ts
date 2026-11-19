import {
  loginAsPetitioner,
  loginAsPetitionsClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Payment Status Pending', () => {
  before(function () {
    cy.task('getRawFeatureFlagValue', {
      flag: 'enable-payment-portal-integration',
    }).as('ENABLE_PAYMENT_PORTAL_INTEGRATION');
    cy.get('@ENABLE_PAYMENT_PORTAL_INTEGRATION').then(
      ENABLE_PAYMENT_PORTAL_INTEGRATION => {
        if (!ENABLE_PAYMENT_PORTAL_INTEGRATION) {
          this.skip();
        }
      },
    );
  });

  it('should display "Pending" after petitioner files and submits payment', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      cy.get(
        `[data-testid="${docketNumber}"] [data-testid="pay-filing-fee-button"]`,
      ).click();

      cy.origin(getCypressEnv().payGovOrigin, () => {
        cy.get(
          'a[data-payment-method="ACH"][data-payment-status="Failed"]',
        ).click();
      });

      cy.get('[data-testid="warning-alert-title"]').contains(
        'Filing fee payment is pending',
      );
      cy.get(`[href="/case-detail/${docketNumber}"]`).click();
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="case-filing-fee-information"]').contains('Pending');
      loginAsPetitionsClerk();
      goToCase(docketNumber);
      cy.get('[data-testid="document-viewer-link-P"]').click();
      cy.get('[data-testid="review-and-serve-petition"]').click();
      cy.get('[data-testid="tab-case-info"]').click();
      cy.get('[data-testid="payment-status-pending-radio"]').contains(
        'Pending',
      );
      cy.get('#payment-status-pending').should('be.checked');
      cy.get('[data-testid="tab-irs-notice"]').click();
      cy.get('[data-testid="has-irs-verified-notice-no"]').click();
      cy.get('[data-testid="submit-case"]').click();
      cy.get('[data-testid="serve-case-to-irs"]').click();
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="edit-case-details-button"]').click();
      cy.get('[data-testid="payment-status-pending-radio"]').contains(
        'Pending',
      );
      cy.get('#payment-status-pending').should('be.checked');
    });
  });
});
