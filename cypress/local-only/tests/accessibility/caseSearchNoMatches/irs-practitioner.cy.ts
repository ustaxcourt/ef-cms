import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Case Search No Matches - Irs Practitioner Accessibility', () => {
  it('should be free of a11y issues', () => {
    loginAsIrsPractitioner();

    cy.visit('/search/no-matches');
    cy.get('[data-testid="header-text"]').should('contain', 'Search Results');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });
});
