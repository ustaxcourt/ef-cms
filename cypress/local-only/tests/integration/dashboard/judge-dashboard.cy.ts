import { assertExists, retry } from '../../../../helpers/retry';
import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectChambers,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../../../support/pages/document-qc';
import {
  loginAsColvin,
  loginAsDocketClerk,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Message Count', () => {
  it("should display the message count on the Judge's dashboard", () => {
    loginAsDocketClerk();
    cy.visit('/case-detail/103-20');
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
});
