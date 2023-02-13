import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAssignsWorkItemToSelf } from './journey/petitionsClerkAssignsWorkItemToSelf';
import { petitionsClerkEditsPetitionInQCIRSNotice } from './journey/petitionsClerkEditsPetitionInQCIRSNotice';
import { petitionsClerkSelectsFirstPetitionOnMyDocumentQC } from './journey/petitionsClerkSelectsFirstPetitionOnMyDocumentQC';
import { petitionsClerkViewsMyDocumentQC } from './journey/petitionsClerkViewsMyDocumentQC';
import { petitionsClerkViewsSectionDocumentQC } from './journey/petitionsClerkViewsSectionDocumentQC';

describe('Entry of Statistics in Petition QC', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });
  petitionerViewsDashboard(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsSectionDocumentQC(cerebralTest);
  petitionsClerkAssignsWorkItemToSelf(cerebralTest);
  petitionsClerkViewsMyDocumentQC(cerebralTest);
  petitionsClerkSelectsFirstPetitionOnMyDocumentQC(cerebralTest);
  petitionsClerkEditsPetitionInQCIRSNotice(cerebralTest);
});
