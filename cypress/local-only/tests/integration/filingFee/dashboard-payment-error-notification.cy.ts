import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import { checkA11y } from '../../../support/generalCommands/checkA11y';

function assertDashboardInitPaymentErrorNotification(): void {
  externalUserCreatesElectronicCase().then(docketNumber => {
    const docketNumberWithoutSuffix = String(docketNumber).replace(
      /[A-Za-z]+$/,
      '',
    );

    cy.intercept('PUT', '**/filing-fee/init-payment', {
      statusCode: 500,
      body: { message: 'payment unavailable' },
    }).as('initPaymentFailure');

    cy.get(`[data-testid="${docketNumberWithoutSuffix}"]`)
      .find('[data-testid="pay-filing-fee-button"]')
      .should('be.visible')
      .click();

    cy.wait('@initPaymentFailure');

    cy.get('[data-testid="error-alert"]')
      .should('be.visible')
      .and('have.class', 'usa-alert--error')
      .and('have.class', 'tw:max-w-[547px]!')
      .and('contain.text', 'Error: payment cannot be started.')
      .and(
        'contain.text',
        `Payment cannot be started for ${docketNumberWithoutSuffix}`,
      );

    cy.get('[data-testid="error-alert"] .usa-alert__heading')
      .should('have.class', 'tw:font-bold')
      .and('have.class', 'tw:text-lg')
      .and('have.class', 'tw:leading-7');

    cy.get('[data-testid="error-alert"] .usa-alert__text')
      .should('have.class', 'tw:font-normal')
      .and('have.class', 'tw:text-xl')
      .and('have.class', 'tw:leading-7');

    cy.get('[data-testid="error-alert"]').contains('button', 'Close');

    checkA11y();

    cy.get('[data-testid="error-alert"]').contains('button', 'Close').click();
    cy.get('[data-testid="error-alert"]').should('not.exist');
  });
}

describe('Dashboard filing fee payment error notification', () => {
  it('should show the styled error notification when init payment fails from My Cases as a petitioner', () => {
    loginAsPetitioner('petitioner@example.com');
    assertDashboardInitPaymentErrorNotification();
  });

  it('should show the styled error notification when init payment fails from My Cases as a private practitioner', () => {
    loginAsPrivatePractitioner();
    assertDashboardInitPaymentErrorNotification();
  });
});
