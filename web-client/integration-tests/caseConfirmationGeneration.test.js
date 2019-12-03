import { fakeFile, setupTest } from './helpers';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkGetsMyMessagesInboxCount from './journey/petitionsClerkGetsMyMessagesInboxCount';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import petitionsClerkViewsMyMessagesInbox from './journey/petitionsClerkViewsMyMessagesInbox';
import userNavigatesToCreateCaseConfirmation from './journey/userNavigatesToCreateCaseConfirmation';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('Case Confirmation', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  describe('Petitoner creates a case / Petitionsclerk Sends to Holding Queue / User then has access to case confirmation', () => {
    petitionerLogin(test);
    petitionerNavigatesToCreateCase(test);
    petitionerChoosesProcedureType(test);
    petitionerChoosesCaseType(test);
    petitionerCreatesNewCase(test, fakeFile);
    userSignsOut(test);
    petitionsClerkLogIn(test);
    petitionsClerkSendsCaseToIRSHoldingQueue(test);
    userNavigatesToCreateCaseConfirmation(test);
    userSignsOut(test);
  });

  describe('Petitionsclerk creates a case then serves case then gets message for case confirmation', () => {
    petitionsClerkLogIn(test);
    petitionsClerkCreatesNewCase(test, fakeFile);
    petitionsClerkViewsMyMessagesInbox(test, true);
    petitionsClerkGetsMyMessagesInboxCount(test);
    petitionsClerkSendsCaseToIRSHoldingQueue(test);
    petitionsClerkRunsBatchProcess(test);
    petitionsClerkViewsMyMessagesInbox(test);
    petitionsClerkGetsMyMessagesInboxCount(test, 1);
    userNavigatesToCreateCaseConfirmation(test);
    userSignsOut(test);
  });
});
