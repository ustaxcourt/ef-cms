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

  it('should have nonempty chambers section in create new message modal', () => {
    loginAsDocketClerk();
    goToCase(caseNumber);
    createMessage();

    selectSection('Chambers');
    selectChambers(chambersSection);
    selectRecipient(recipient);
  });

  it('should have nonempty chambers sections in forward message modal', () => {
    createForwardableMessage(caseNumber).then(messageToForwardSubject => {
      loginAsDocketClerk();
      goToCase(caseNumber);
      forwardMessage(messageToForwardSubject);

      selectSection('Chambers');
      selectChambers(chambersSection);
      selectRecipient(recipient);
    });
  });

  it('should have nonempty chambers sections in docket QC complete and send message modal', () => {
    loginAsDocketClerk();
    cy.visit('/document-qc/section/inbox');
    cy.get('.big-blue-header').should('exist');
    goToDocumentNeedingQC();
    openCompleteAndSendMessageDialog();

    selectSection('Chambers');
    selectChambers(chambersSection);
    selectRecipient(recipient);
  });
});

const createForwardableMessage = (
  docketNumber: string,
): Cypress.Chainable<string> => {
  const messageToForwardSubject = v4();

  loginAsDocketClerk();
  goToCase(docketNumber);
  createMessage();
  selectSection('Docket');
  selectRecipient('Test Docketclerk');
  enterSubject(messageToForwardSubject);
  fillOutMessageField();
  sendMessage();
  cy.get('[data-testid="success-alert"]').should('exist');

  return cy.wrap(messageToForwardSubject);
};
