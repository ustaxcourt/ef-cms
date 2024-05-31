import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Unconsolidate Cases Modal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/case-detail/111-19');
    cy.get('[data-testid="docket-record-table"]');
    cy.get('[data-testid="tab-case-information"]').click();
    cy.get('[data-testid="unconsolidate-cases-button"]').click();
    cy.get('[data-testid="modal-confirm"]');

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
