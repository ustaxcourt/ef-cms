import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsIrsSuperUser } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Case Detail - IRS Super User Accessibility', () => {
  it('should be free of a11y issues when performing docket search', () => {
    loginAsIrsSuperUser();
    cy.visit('/case-detail/103-19');
    cy.get('#case-title').should('exist');

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
