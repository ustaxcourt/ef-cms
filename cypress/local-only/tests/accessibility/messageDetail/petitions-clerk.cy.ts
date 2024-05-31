import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Message Detail - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitionsClerk();
    cy.visit(
      '/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
    );
    cy.contains('Message');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { 'nested-interactive': { enabled: false } },
      },
      terminalLog,
    );
  });

  // TODO fix aria issues
  it('should be free of a11y issues when forwarding', () => {
    loginAsPetitionsClerk();
    cy.visit(
      '/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
    );
    cy.get('#button-forward').click();
    cy.get('.modal-dialog').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { 'nested-interactive': { enabled: false } },
      },
      terminalLog,
    );
  });

  // TODO fix aria issues
  it('should be free of a11y issues when replying', () => {
    loginAsPetitionsClerk();
    cy.visit(
      '/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
    );
    cy.get('#button-reply').click();
    cy.get('.modal-dialog').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { 'nested-interactive': { enabled: false } },
      },
      terminalLog,
    );
  });

  // TODO fix aria issues
  it('should be free of a11y issues when completing', () => {
    loginAsPetitionsClerk();
    cy.visit(
      '/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
    );
    cy.get('#button-complete').click();
    cy.get('.modal-dialog').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { 'nested-interactive': { enabled: false } },
      },
      terminalLog,
    );
  });
});
