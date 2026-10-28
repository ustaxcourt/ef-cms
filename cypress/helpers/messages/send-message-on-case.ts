import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectChambers,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../../local-only/support/pages/document-qc';
import { goToCase } from '../caseDetail/go-to-case';

export type MessageRecipient = {
  section: string;
  chambers?: string;
  recipient: string;
};

/**
 * Sends a message on the given case as the currently logged-in court user.
 */
export function sendMessageOnCase({
  docketNumber,
  subject,
  to,
}: {
  docketNumber: string;
  subject: string;
  to: MessageRecipient;
}): void {
  goToCase(docketNumber);
  createMessage();
  selectSection(to.section);
  if (to.chambers) {
    selectChambers(to.chambers);
  }
  selectRecipient(to.recipient);
  enterSubject(subject);
  fillOutMessageField();
  cy.intercept('POST', '**/messages').as('createMessage');
  sendMessage();
  cy.wait('@createMessage');
  cy.get('[data-testid="success-alert"]').should('exist');
}

/**
 * Completes the message with the given subject from the current user's
 * My Messages inbox.
 */
export function completeMessageFromMyInbox(subject: string): void {
  cy.visit('/messages/my/inbox');
  cy.contains('tr', subject).find('input[type="checkbox"]').check();
  cy.get('[data-testid="message-batch-mark-as-complete"]').click();
  cy.get('[data-testid="message-detail-success-alert"]').should('exist');
}
