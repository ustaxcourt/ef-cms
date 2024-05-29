import { loginAsAdc } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Case Detail - ADC Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('docket record - should be free of a11y issues', () => {
    loginAsAdc();

    cy.visit('/case-detail/101-19');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: ['serious', 'critical'],
      }, // minor/moderate/serious/critical
      terminalLog,
    );
  });
});
