const {
  createMessage,
  enterSubject,
  fillOutMessageField,
  goToCaseDetail,
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
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const { getUserToken, login } = getEnvironmentSpecificFunctions();

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
let token = null;

describe('Docket Clerk', () => {
  before(async () => {
    const results = await getUserToken(
      'docketclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  describe('complete and send message', () => {
    it('should go to section document QC inbox', () => {
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
    // go to message ^^^
    // reply to it
    // expect that the message came to me (we think with the bug this would have been broken)
  });
  describe('forward a message', () => {
    // go to message ^^^
    // forward it
    // expect that the message came to me (we think with the bug this would have been broken)
  });
  describe('complete a message', () => {
    // go to message ^^^
    // complete it
    // expect that the message came to me (we think with the bug this would have been broken)
  });
});
