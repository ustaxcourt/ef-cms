const {
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
// complete and send message
// fill out form
// send message

// go to 103-20
// create new message
// send message

// go to message ^^^
// reply to it
// expect that the message came to me (we think with the bug this would have been broken)

// go to message ^^^
// forward it
// expect that the message came to me (we think with the bug this would have been broken)

// go to message ^^^
// complete it
// expect that the message came to me (we think with the bug this would have been broken)
