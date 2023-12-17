import { assertExists, retry } from '../../helpers/retry';
import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectChambers,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../support/pages/document-qc';
import {
  loginAsColvin,
  loginAsColvinChambers,
} from '../../helpers/auth/login-as-helpers';

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

    retry(() => {
      loginAsColvin();
      return assertExists('[data-testid="header-message-count"]');
    });
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

    retry(() => {
      loginAsColvinChambers();
      return assertExists('[data-testid="header-message-count"]');
    });
  });
});
