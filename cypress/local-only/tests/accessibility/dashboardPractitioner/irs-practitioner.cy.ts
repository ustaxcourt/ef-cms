import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Dashboard Practitioner - Irs Practitioner Accessibility', () => {
  it('should be free of a11y issues', () => {
    loginAsIrsPractitioner();

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { 'nested-interactive': { enabled: false } }, // https://github.com/flexion/ef-cms/issues/10396
      },
      terminalLog,
    );
  });
});
