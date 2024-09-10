export const getIdOfLastSentMessage = (): Cypress.Chainable<
  string | undefined
> => {
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
};
