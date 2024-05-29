import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('File a Petition Page - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues for step 1', () => {
    loginAsPrivatePractitioner();
    cy.visit('/file-a-petition/step-1');
    cy.get('[data-testid="complete-step-1"]').should('exist');
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
