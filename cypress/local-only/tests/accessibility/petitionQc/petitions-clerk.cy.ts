import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Petition QC - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues for confirm replace petition modal', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/121-20/petition-qc');
    cy.contains('Petition').should('exist');
    cy.get('.remove-pdf-button').click();
    cy.get('.confirm-replace-petition-modal').should('exist');

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

  it('should be free of a11y issues on the parties tab', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/104-19/petition-qc?tab=partyInfo');
    cy.contains('Petition').should('exist');

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

  // TODO aria list element
  it('should be free of a11y issues on the case info tab', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/104-19/petition-qc?tab=caseInfo');
    cy.contains('Petition').should('exist');

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

  it('should be free of a11y issues on the irs notice tab', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/102-19/petition-qc?tab=irsNotice');
    cy.contains('Petition').should('exist');
    cy.get('#has-irs-verified-notice-yes').click();
    cy.get('#date-of-notice-picker').should('exist');

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
