import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectChambers,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../support/pages/document-qc';

describe('Message Count', () => {
  it("should display the message count on the Judge's dashboard", () => {
    cy.login('docketclerk', '/case-detail/103-20');
    createMessage();
    selectSection('Chambers');
    selectChambers('colvinsChambers');
    selectRecipient('Judge Colvin');
    enterSubject();
    fillOutMessageField();
    sendMessage();

    cy.login('judgecolvin');
    cy.get('[data-testid="header-message-count"]').should('exist');
  });

  it("should display the message count on the Chamber's dashboard", () => {
    cy.login('docketclerk', '/case-detail/103-20');
    createMessage();
    selectSection('Chambers');
    selectChambers('colvinsChambers');
    selectRecipient("Test Colvin's Chambers");
    enterSubject();
    fillOutMessageField();
    sendMessage();

    cy.login('colvinschambers');
    cy.get('[data-testid="header-message-count"]').should('exist');
  });
});
