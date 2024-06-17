import { impactLevel } from '../../../helpers/accessibility-impact';
import { terminalLog } from '../../../helpers/cypressTasks/logs';

export function checkA11y(): void {
  cy.injectAxe();

  cy.checkA11y(
    undefined,
    {
      includedImpacts: impactLevel,
      retries: 3,
      rules: {
        'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
      },
    },
    terminalLog,
  );
}
