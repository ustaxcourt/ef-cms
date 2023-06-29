import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkBulkAssignsCases } from './journey/petitionsClerkBulkAssignsCases';
import { petitionsClerkGetsMyDocumentQCInboxCount } from './journey/petitionsClerkGetsMyDocumentQCInboxCount';
import { petitionsClerkGetsSectionDocumentQCInboxCount } from './journey/petitionsClerkGetsSectionDocumentQCInboxCount';
import { petitionsClerkVerifiesAssignedWorkItem } from './journey/petitionsClerkVerifiesAssignedWorkItem';
import { petitionsClerkViewsMyDocumentQC } from './journey/petitionsClerkViewsMyDocumentQC';
import { petitionsClerkViewsSectionDocumentQC } from './journey/petitionsClerkViewsSectionDocumentQC';

describe('Petitions Clerk Document QC Journey', () => {
  const cerebralTest = setupTest();

  const createdCases = [];
  const caseCreationCount = 3;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsSectionDocumentQC(cerebralTest, true);
  petitionsClerkViewsMyDocumentQC(cerebralTest, true);

  loginAs(cerebralTest, 'petitioner@example.com');

  // Create multiple cases for testing
  for (let i = 0; i < caseCreationCount; i++) {
    it(`create case ${i + 1}`, async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      createdCases.push(caseDetail);
    });
  }

  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsSectionDocumentQC(cerebralTest);
  petitionsClerkGetsSectionDocumentQCInboxCount(
    cerebralTest,
    caseCreationCount,
  );
  petitionsClerkBulkAssignsCases(cerebralTest, createdCases);
  petitionsClerkViewsMyDocumentQC(cerebralTest);
  petitionsClerkGetsMyDocumentQCInboxCount(cerebralTest, caseCreationCount);
  petitionsClerkVerifiesAssignedWorkItem(cerebralTest, createdCases);
});
