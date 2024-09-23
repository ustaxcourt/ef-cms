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

  it('should have nonempty chambers section in create new message modal', () => {
    loginAsDocketClerk();
    goToCase('103-20');
    createMessage();

    selectSection('Chambers');
    selectChambers(chambersSection);
    selectRecipient(recipient);
  });

  it('should have nonempty chambers sections in forward message modal', () => {
    loginAsDocketClerk();
    goToCase('103-20');
    createMessage();
    selectSection('Docket');
    selectRecipient('Test Docketclerk');
    const subject = v4();
    enterSubject(subject);
    fillOutMessageField();
    sendMessage();
    forwardMessage(subject);

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
