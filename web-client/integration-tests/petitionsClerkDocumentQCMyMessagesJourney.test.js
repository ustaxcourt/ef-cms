import { fakeFile, setupTest } from './helpers';
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
import taxPayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerAddNewCaseToTestObj from './journey/taxpayerAddNewCaseToTestObj';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';

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

  taxpayerLogin(test);

  // Create multiple cases for testing
  for (let i = 0; i < caseCreationCount; i++) {
    taxpayerNavigatesToCreateCase(test);
    taxpayerChoosesProcedureType(test);
    taxpayerChoosesCaseType(test);
    taxpayerCreatesNewCase(test, fakeFile);
    taxpayerAddNewCaseToTestObj(test);
  }

  taxPayerSignsOut(test);

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
