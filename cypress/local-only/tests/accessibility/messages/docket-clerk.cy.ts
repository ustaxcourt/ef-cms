import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Messages', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('My', () => {
    it('Inbox - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.url().should('include', 'messages/my/inbox');

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

    it('Sent - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/my/outbox');
      cy.get('[data-testid="sent-tab-content"]').should('exist');

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

    it('Completed - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/my/completed');
      cy.get('[data-testid="completed-tab-content"]').should('exist');

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

  describe('Section', () => {
    it('Inbox - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/section/inbox');
      cy.get('[data-testid="inbox-tab-content"]').should('exist');

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

    it('Sent - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/section/outbox');
      cy.get('[data-testid="sent-tab-content"]').should('exist');

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

    it('Completed - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/section/completed');
      cy.get('[data-testid="completed-tab-content"]').should('exist');

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
});
