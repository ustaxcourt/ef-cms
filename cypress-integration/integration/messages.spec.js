const {
  createMessage,
  enterSubject,
  fillOutMessageField,
  goToDocumentNeedingQC,
  goToMyDocumentQC,
  goToSectionDocumentQC,
  openCompleteAndSendMessageDialog,
  progressIndicatorDoesNotExist,
  selectRecipient,
  selectSection,
  sendMessage,
} = require('../support/pages/document-qc');
const { goToCaseDetail } = require('../support/pages/case-detail');

describe('Messages', () => {
  describe('Docket clerk completes qc and sends a message', () => {
    it('should go to section document QC inbox', () => {
      cy.login('docketclerk');
      cy.get('.big-blue-header').should('exist');
      goToMyDocumentQC();
      goToSectionDocumentQC();
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

  describe('Docket clerk creates and sends a message', () => {
    it('should go to case detail and open the dialog to create a new message', () => {
      cy.login('docketclerk');
      goToCaseDetail('103-20');
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
});
