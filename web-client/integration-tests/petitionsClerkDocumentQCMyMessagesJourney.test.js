import { fakeFile, setupTest } from './helpers';
import petitionerAddNewCaseToTestObj from './journey/petitionerAddNewCaseToTestObj';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionsClerkBulkAssignsCases from './journey/petitionsClerkBulkAssignsCases';
import petitionsClerkCreatesMessage from './journey/petitionsClerkCreatesMessage';
import petitionsClerkGetsMyDocumentQCInboxCount from './journey/petitionsClerkGetsMyDocumentQCInboxCount';
import petitionsClerkGetsMyMessagesInboxCount from './journey/petitionsClerkGetsMyMessagesInboxCount';
import petitionsClerkGetsSectionDocumentQCInboxCount from './journey/petitionsClerkGetsSectionDocumentQCInboxCount';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
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

  petitionsClerkLogIn(test);
  petitionsClerkViewsSectionDocumentQC(test, true);
  petitionsClerkViewsMyDocumentQC(test, true);
  petitionsClerkSignsOut(test);

  petitionerLogin(test);

  // Create multiple cases for testing
  for (let i = 0; i < caseCreationCount; i++) {
    petitionerNavigatesToCreateCase(test);
    petitionerChoosesProcedureType(test);
    petitionerChoosesCaseType(test);
    petitionerCreatesNewCase(test, fakeFile);
    petitionerAddNewCaseToTestObj(test);
  }

  petitionerSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkViewsSectionDocumentQC(test);
  petitionsClerkGetsSectionDocumentQCInboxCount(test, caseCreationCount);
  petitionsClerkBulkAssignsCases(test);
  petitionsClerkViewsMyDocumentQC(test);
  petitionsClerkGetsMyDocumentQCInboxCount(test, caseCreationCount);
  petitionsClerkVerifiesAssignedWorkItem(test);
  petitionsClerkVerifiesUnreadMessage(test);
  petitionsClerkCreatesMessage(test, 'Here comes the hotstepper!');
  petitionsClerkSignsOut(test);

  petitionsClerkLogIn(test, 'petitionsclerk1');
  petitionsClerkViewsMyMessagesInbox(test, true);
  petitionsClerkGetsMyMessagesInboxCount(test);
  petitionsClerkViewsUnreadMessage(test, 'Here comes the hotstepper!');
  petitionsClerkGetsMyMessagesInboxCount(test, -1);
  petitionsClerkSignsOut(test);
});
