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

describe('Docket Clerk', () => {
  describe('complete and send message', () => {
    it('should go to section document QC inbox', () => {
      cy.login('docketclerk'); // this can be any logged in user
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

  describe('create and send a message', () => {
    it('should go to case detail and open the dialog to create a new message', () => {
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
