export const docketClerkQCsDocument = (
  docketNumber: string,
  docketEntryId: string,
  sendMessage?: { body: string; recipient: string; section: string },
) => {
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
  } else {
    cy.get('#save-and-finish').click();
    cy.get('[data-testid="success-alert"]').should('exist');
  }
};
