import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Messages', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('My', () => {
    it('Inbox - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.url().should('include', 'messages/my/inbox');

      cy.runA11y();
    });

    it('Sent - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/my/outbox');
      cy.get('[data-testid="sent-tab-content"]').should('exist');

      cy.runA11y();
    });

    it('Completed - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/my/completed');
      cy.get('[data-testid="completed-tab-content"]').should('exist');

      cy.runA11y();
    });
  });

  describe('Section', () => {
    it('Inbox - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/section/inbox');
      cy.get('[data-testid="inbox-tab-content"]').should('exist');

      cy.runA11y();
    });

    it('Sent - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/section/outbox');
      cy.get('[data-testid="sent-tab-content"]').should('exist');

      cy.runA11y();
    });

    it('Completed - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/section/completed');
      cy.get('[data-testid="completed-tab-content"]').should('exist');

      cy.runA11y();
    });
  });
});
