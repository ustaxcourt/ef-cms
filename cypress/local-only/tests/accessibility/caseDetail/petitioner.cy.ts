import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Case Detail Page - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();
    cy.visit('/case-detail/101-19');
    cy.get('[data-testid="docket-record-table"]').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
          'nested-interactive': { enabled: false }, // TODO LINK
        },
      },
      terminalLog,
    );
  });

  it('should be free of a11y issues when editing contact details', () => {
    loginAsPetitioner();
    cy.visit(
      '/case-detail/108-19/contacts/7805d1ab-18d0-43ec-bafb-654e83405416/edit',
    );
    cy.contains('Contact name').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
        },
      },
      terminalLog,
    );
  });
});
