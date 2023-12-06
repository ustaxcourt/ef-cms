import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerCancelsCreateCase } from './journey/petitionerCancelsCreateCase';
import { petitionerFilesAmendedMotion } from './journey/petitionerFilesAmendedMotion';
import { petitionerFilesDocumentForCase } from './journey/petitionerFilesDocumentForCase';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionerViewsCaseDetailAfterFilingDocument } from './journey/petitionerViewsCaseDetailAfterFilingDocument';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';

describe('petitioner files document', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerCancelsCreateCase(cerebralTest);
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      caseType: 'Whistleblower',
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsCaseDetail(cerebralTest, {
    documentCount: 4,
  });
  petitionerFilesDocumentForCase(cerebralTest, fakeFile);
  petitionerViewsCaseDetailAfterFilingDocument(cerebralTest, {
    documentCount: 8,
  });
  petitionerFilesAmendedMotion(cerebralTest, fakeFile);
});
