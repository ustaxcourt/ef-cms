import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAssignsWorkItemToSelf } from './journey/petitionsClerkAssignsWorkItemToSelf';
import { petitionsClerkSelectsFirstPetitionOnMyDocumentQC } from './journey/petitionsClerkSelectsFirstPetitionOnMyDocumentQC';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsMyDocumentQC } from './journey/petitionsClerkViewsMyDocumentQC';
import { petitionsClerkViewsSectionDocumentQC } from './journey/petitionsClerkViewsSectionDocumentQC';

describe('INDIVIDUAL DOC QC: Petition Gets Served', () => {
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
  petitionsClerkSubmitsCaseToIrs(cerebralTest);
});
