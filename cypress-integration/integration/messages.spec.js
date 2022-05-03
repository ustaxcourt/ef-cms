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
const {
  goToCaseDetail,
  goToMessageDetail,
  openCompleteMessageModal,
  openForwardMessageModal,
  openReplyToMessageModal,
} = require('../support/pages/case-detail');
const { goToCaseMessages } = require('../support/pages/case-detail');

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

  describe('reply to a message', () => {
    it('should go to case detail, navigate to case messages, and go to the first message detail', () => {
      goToCaseDetail('103-20');
      goToCaseMessages();
      goToMessageDetail();
    });

    it('should reply to the message', () => {
      openReplyToMessageModal();
      fillOutMessageField();
      sendMessage();
    });

    // expect that the message came to me (we think with the bug this would have been broken)
  });
  describe('forward a message', () => {
    it('should go to case detail, navigate to case messages, and go to the first message detail', () => {
      goToCaseDetail('103-20');
      goToCaseMessages();
      goToMessageDetail();
    });

    it('should forward the message', () => {
      openForwardMessageModal();
      selectSection('ADC');
      selectRecipient('Test ADC');
      enterSubject();
      fillOutMessageField();
      sendMessage();
    });

    // expect that the message came to me (we think with the bug this would have been broken)
  });

  describe('complete a message', () => {
    it('should go to case detail, navigate to case messages, and go to the first message detail', () => {
      goToCaseDetail('103-20');
      goToCaseMessages();
      goToMessageDetail();
    });

    it('should complete the message', () => {
      openCompleteMessageModal();
      sendMessage();
    });

    // expect that the message came to me (we think with the bug this would have been broken)
  });
});
