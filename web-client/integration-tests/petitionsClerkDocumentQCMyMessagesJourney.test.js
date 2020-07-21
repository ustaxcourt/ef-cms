import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkBulkAssignsCases } from './journey/petitionsClerkBulkAssignsCases';
import { petitionsClerkCreatesMessage } from './journey/petitionsClerkCreatesMessage';
import { petitionsClerkGetsMyDocumentQCInboxCount } from './journey/petitionsClerkGetsMyDocumentQCInboxCount';
import { petitionsClerkGetsMyMessagesInboxCount } from './journey/petitionsClerkGetsMyMessagesInboxCount';
import { petitionsClerkGetsSectionDocumentQCInboxCount } from './journey/petitionsClerkGetsSectionDocumentQCInboxCount';
import { petitionsClerkVerifiesAssignedWorkItem } from './journey/petitionsClerkVerifiesAssignedWorkItem';
import { petitionsClerkVerifiesUnreadMessage } from './journey/petitionsClerkVerifiesUnreadMessage';
import { petitionsClerkViewsMyDocumentQC } from './journey/petitionsClerkViewsMyDocumentQC';
import { petitionsClerkViewsMyMessagesInbox } from './journey/petitionsClerkViewsMyMessagesInbox';
import { petitionsClerkViewsSectionDocumentQC } from './journey/petitionsClerkViewsSectionDocumentQC';
import { petitionsClerkViewsUnreadMessage } from './journey/petitionsClerkViewsUnreadMessage';

const test = setupTest();

describe('Petitions Clerk Document QC Journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  const createdCases = [];

  const caseCreationCount = 3;

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsSectionDocumentQC(test, true);
  petitionsClerkViewsMyDocumentQC(test, true);

  loginAs(test, 'petitioner@example.com');

  // Create multiple cases for testing
  for (let i = 0; i < caseCreationCount; i++) {
    it(`create case ${i + 1}`, async () => {
      const caseDetail = await uploadPetition(test);
      expect(caseDetail.docketNumber).toBeDefined();
      createdCases.push(caseDetail);
    });
  }

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsSectionDocumentQC(test);
  petitionsClerkGetsSectionDocumentQCInboxCount(test, caseCreationCount);
  petitionsClerkBulkAssignsCases(test, createdCases);
  petitionsClerkViewsMyDocumentQC(test);
  petitionsClerkGetsMyDocumentQCInboxCount(test, caseCreationCount);
  petitionsClerkVerifiesAssignedWorkItem(test, createdCases);
  petitionsClerkVerifiesUnreadMessage(test, createdCases);
  petitionsClerkCreatesMessage(
    test,
    'Here comes the hotstepper!',
    createdCases,
  );

  loginAs(test, 'petitionsclerk1@example.com');
  petitionsClerkViewsMyMessagesInbox(test, true);
  petitionsClerkGetsMyMessagesInboxCount(test);
  petitionsClerkViewsUnreadMessage(test, 'Here comes the hotstepper!');
  petitionsClerkGetsMyMessagesInboxCount(test, -1);
});
