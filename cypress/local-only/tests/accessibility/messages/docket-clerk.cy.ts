import { checkA11y } from '../../../support/generalCommands/checkA11y';
import {
  completeMessageFromMyInbox,
  sendMessageOnCase,
} from '../../../../helpers/messages/send-message-on-case';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

// Seed data has no completed messages, so create one to ensure the
// Completed tables render at least one row (with a docket number link).
function createCompletedMessageAsDocketClerk(): void {
  const subject = `Docket clerk a11y ${getCurrentDateTimeInMillis()}`;
  sendMessageOnCase({
    docketNumber: '103-20',
    subject,
    to: { recipient: 'Test Docketclerk', section: 'docket' },
  });
  completeMessageFromMyInbox(subject);
}

describe('Messages', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('My', () => {
    it('Inbox - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.url().should('include', 'messages/my/inbox');

      checkA11y();
    });

    it('Sent - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/my/outbox');
      cy.get('[data-testid="sent-tab-content"]').should('exist');

      checkA11y();
    });

    it('Completed - should be free of a11y issues', () => {
      loginAsDocketClerk();
      createCompletedMessageAsDocketClerk();

      cy.visit('messages/my/completed');
      cy.get('[data-testid="completed-tab-content"]').should('exist');
      cy.get(
        '[data-testid="messages-individual-completed-docketNumber-cell"] a',
      ).should('exist');

      checkA11y();
    });
  });

  describe('Section', () => {
    it('Inbox - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/section/inbox');
      cy.get('[data-testid="inbox-tab-content"]').should('exist');

      checkA11y();
    });

    it('Sent - should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('messages/section/outbox');
      cy.get('[data-testid="sent-tab-content"]').should('exist');

      checkA11y();
    });

    it('Completed - should be free of a11y issues', () => {
      loginAsDocketClerk();
      createCompletedMessageAsDocketClerk();

      cy.visit('messages/section/completed');
      cy.get('[data-testid="completed-tab-content"]').should('exist');
      cy.get(
        '[data-testid="messages-section-completed-docketNumber-cell"] a',
      ).should('exist');

      checkA11y();
    });
  });
});
