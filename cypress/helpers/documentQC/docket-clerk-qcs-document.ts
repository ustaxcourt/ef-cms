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
    cy.get('[data-testid="header-messages-link"]').click();
    cy.get('[data-testid="messages-outbox-tab"]').click();
    return cy
      .get('[data-testid="message-individual-outbox-table"]')
      .find('tbody > tr')
      .first()
      .invoke('attr', 'data-testid')
      .then(messageId => {
        return cy.wrap(messageId);
      });
  } else {
    cy.get('#save-and-finish').click();
    cy.get('[data-testid="success-alert"]').should('exist');
  }
};
