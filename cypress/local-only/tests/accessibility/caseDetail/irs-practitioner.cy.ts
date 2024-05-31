import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Case Detail - IRS Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsIrsPractitioner();

    cy.visit('/case-detail/105-19');
    cy.get('[data-testid="docket-record-table"]').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'nested-interactive': { enabled: false }, // TODO LINK
        },
      },
      terminalLog,
    );
  });

  describe('Sealed cases', () => {
    it('should be free of a11y issues', () => {
      loginAsIrsPractitioner();

      cy.visit('/case-detail/102-20');
      cy.get('[data-testid="sealed-case-banner"]').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });
});
