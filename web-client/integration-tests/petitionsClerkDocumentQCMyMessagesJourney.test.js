import { fakeFile, loginAs, setupTest } from './helpers';
import petitionerAddNewCaseToTestObj from './journey/petitionerAddNewCaseToTestObj';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionsClerkBulkAssignsCases from './journey/petitionsClerkBulkAssignsCases';
import petitionsClerkCreatesMessage from './journey/petitionsClerkCreatesMessage';
import petitionsClerkGetsMyDocumentQCInboxCount from './journey/petitionsClerkGetsMyDocumentQCInboxCount';
import petitionsClerkGetsMyMessagesInboxCount from './journey/petitionsClerkGetsMyMessagesInboxCount';
import petitionsClerkGetsSectionDocumentQCInboxCount from './journey/petitionsClerkGetsSectionDocumentQCInboxCount';
import petitionsClerkVerifiesAssignedWorkItem from './journey/petitionsClerkVerifiesAssignedWorkItem';
import petitionsClerkVerifiesUnreadMessage from './journey/petitionsClerkVerifiesUnreadMessage';
import petitionsClerkViewsMyDocumentQC from './journey/petitionsClerkViewsMyDocumentQC';
import petitionsClerkViewsMyMessagesInbox from './journey/petitionsClerkViewsMyMessagesInbox';
import petitionsClerkViewsSectionDocumentQC from './journey/petitionsClerkViewsSectionDocumentQC';
import petitionsClerkViewsUnreadMessage from './journey/petitionsClerkViewsUnreadMessage';

const test = setupTest();

describe('Petitions Clerk Document QC Journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  const caseCreationCount = 3;

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsSectionDocumentQC(test, true);
  petitionsClerkViewsMyDocumentQC(test, true);

  loginAs(test, 'petitioner');

  // Create multiple cases for testing
  for (let i = 0; i < caseCreationCount; i++) {
    petitionerNavigatesToCreateCase(test);
    petitionerChoosesProcedureType(test);
    petitionerChoosesCaseType(test);
    petitionerCreatesNewCase(test, fakeFile);
    petitionerAddNewCaseToTestObj(test);
  }

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsSectionDocumentQC(test);
  petitionsClerkGetsSectionDocumentQCInboxCount(test, caseCreationCount);
  petitionsClerkBulkAssignsCases(test);
  petitionsClerkViewsMyDocumentQC(test);
  petitionsClerkGetsMyDocumentQCInboxCount(test, caseCreationCount);
  petitionsClerkVerifiesAssignedWorkItem(test);
  petitionsClerkVerifiesUnreadMessage(test);
  petitionsClerkCreatesMessage(test, 'Here comes the hotstepper!');

  loginAs(test, 'petitionsclerk1');
  petitionsClerkViewsMyMessagesInbox(test, true);
  petitionsClerkGetsMyMessagesInboxCount(test);
  petitionsClerkViewsUnreadMessage(test, 'Here comes the hotstepper!');
  petitionsClerkGetsMyMessagesInboxCount(test, -1);
});
