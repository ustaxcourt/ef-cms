// make sure the chambers dropdown works in open message, qc, and forward

import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  forwardMessage,
  goToDocumentNeedingQC,
  openCompleteAndSendMessageDialog,
  selectChambers,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../../../support/pages/document-qc';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { v4 } from 'uuid';

describe('BUG: chambers dropdown should be populated in message modals', () => {
  const chambersSection = 'buchsChambers';
  const recipient = 'Judge Buch';
  const caseNumber = '103-20';
  const messageToForwardSubject = v4();

  before(() => {
    // Send a message that we will forward later.
    // We do this here rather than in the message forward test itself because
    // judgesChambers are cached, so the message forward test could
    // "pass" when it shouldn't if we create a message (and populate cache) first.
    loginAsDocketClerk();
    goToCase(caseNumber);
    createMessage();
    selectSection('Docket');
    selectRecipient('Test Docketclerk');
    enterSubject(messageToForwardSubject);
    fillOutMessageField();
    sendMessage();
  });

  it('should have nonempty chambers section in create new message modal', () => {
    loginAsDocketClerk();
    goToCase(caseNumber);
    createMessage();

    selectSection('Chambers');
    selectChambers(chambersSection);
    selectRecipient(recipient);
  });

  it('should have nonempty chambers sections in forward message modal', () => {
    loginAsDocketClerk();
    goToCase(caseNumber);
    forwardMessage(messageToForwardSubject);

    selectSection('Chambers');
    selectChambers(chambersSection);
    selectRecipient(recipient);
  });

  it('should have nonempty chambers sections in docket QC complete and send message modal', () => {
    cy.login('docketclerk', '/document-qc/section/inbox');
    cy.get('.big-blue-header').should('exist');
    goToDocumentNeedingQC();
    openCompleteAndSendMessageDialog();

    selectSection('Chambers');
    selectChambers(chambersSection);
    selectRecipient(recipient);
  });
});
