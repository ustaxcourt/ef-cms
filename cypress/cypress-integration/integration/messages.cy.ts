import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  goToDocumentNeedingQC,
  openCompleteAndSendMessageDialog,
  progressIndicatorDoesNotExist,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../support/pages/document-qc';

import {
  getCaseStatusFilter,
  messagesShouldBeFiltered,
  selectsCaseStatusFilterNew,
} from '../support/pages/dashboard';

describe('Messages', () => {
  describe('Docket clerk completes qc and sends a message', () => {
    it('should go to section document QC inbox', () => {
      cy.login('docketclerk', '/document-qc/section/inbox');
      cy.get('.big-blue-header').should('exist');
    });

    it('should go to first document needing QC', () => {
      goToDocumentNeedingQC();
    });

    it('should open dialog to complete & send message', () => {
      openCompleteAndSendMessageDialog();
    });

    it('should fill out dialog to complete & send message', () => {
      selectSection('ADC');
      selectRecipient('Test ADC');
      fillOutMessageField();
    });

    it('should send the message', () => {
      sendMessage();
      progressIndicatorDoesNotExist();
    });
  });

  describe('Docket clerk creates and sends a message on a "Calendared" case', () => {
    it('should go to case detail and open the dialog to create a new message', () => {
      cy.login('docketclerk', '/case-detail/103-20');
      createMessage();
    });

    it('should fill out the form and send the new message', () => {
      selectSection('ADC');
      selectRecipient('Test ADC');
      enterSubject();
      fillOutMessageField();
      sendMessage();
      progressIndicatorDoesNotExist();
    });
  });

  describe('Docket clerk creates and sends a message on a "New" case', () => {
    it('should go to case detail and open the dialog to create a new message', () => {
      cy.login('docketclerk', '/case-detail/102-20');
      createMessage();
    });

    it('should fill out the form and send the new message', () => {
      selectSection('ADC');
      selectRecipient('Test ADC');
      enterSubject();
      fillOutMessageField();
      sendMessage();
      progressIndicatorDoesNotExist();
    });
  });

  describe('ADC views messages', () => {
    it('should be able to filter messages', () => {
      cy.login('adc');
      getCaseStatusFilter();
      selectsCaseStatusFilterNew();
      messagesShouldBeFiltered();
    });
  });
});
