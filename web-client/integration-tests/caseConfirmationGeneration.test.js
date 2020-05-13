import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkGetsMyMessagesInboxCount from './journey/petitionsClerkGetsMyMessagesInboxCount';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkViewsMyMessagesInbox from './journey/petitionsClerkViewsMyMessagesInbox';
import userNavigatesToCreateCaseConfirmation from './journey/userNavigatesToCreateCaseConfirmation';

const test = setupTest();

describe('Case Confirmation', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  describe('Petitioner creates a case / Petitionsclerk Sends to Holding Queue / Petitionsclerk then has access to case confirmation', () => {
    loginAs(test, 'petitioner');
    petitionerChoosesProcedureType(test);
    petitionerChoosesCaseType(test);
    petitionerCreatesNewCase(test, fakeFile);
    loginAs(test, 'petitionsclerk');
    petitionsClerkSubmitsCaseToIrs(test);
    userNavigatesToCreateCaseConfirmation(test);
  });

  describe('Petitioner creates a case / Petitionsclerk Sends to Holding Queue / Petitioner then has access to case confirmation', () => {
    loginAs(test, 'petitioner');
    petitionerChoosesProcedureType(test);
    petitionerChoosesCaseType(test);
    petitionerCreatesNewCase(test, fakeFile);
    loginAs(test, 'petitionsclerk');
    petitionsClerkSubmitsCaseToIrs(test);
    loginAs(test, 'petitioner');
    userNavigatesToCreateCaseConfirmation(test);
  });

  describe('Petitionsclerk creates a case then serves case then gets message for case confirmation', () => {
    loginAs(test, 'petitionsclerk');
    petitionsClerkCreatesNewCase(test, fakeFile);
    petitionsClerkViewsMyMessagesInbox(test, true);
    petitionsClerkGetsMyMessagesInboxCount(test);
    userNavigatesToCreateCaseConfirmation(test);
  });
});
