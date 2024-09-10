import { getIdOfLastSentMessage } from '../messages/get-id-of-last-sent-message';

export const docketClerkQCsDocument = (
  docketNumber: string,
  docketEntryId: string,
  sendMessage?: { body: string; recipient: string; section: string },
): Cypress.Chainable<string | undefined> | undefined => {
  cy.login(
    'docketclerk1',
    `/case-detail/${docketNumber}/documents/${docketEntryId}/edit?fromPage=qc-section-inbox`,
  );
  if (sendMessage) {
    cy.get('#save-and-add-supporting').click();
    cy.get('#toSection').select(sendMessage.section);
    cy.get('#toUserId').select(sendMessage.recipient);
    cy.get('#message').type(sendMessage.body);
    cy.get('[data-testid="modal-confirm"]').click();
    cy.get('[data-testid="success-alert"]').should('exist');
    return getIdOfLastSentMessage();
  } else {
    cy.get('#save-and-finish').click();
    cy.get('[data-testid="success-alert"]').should('exist');
  }
};
