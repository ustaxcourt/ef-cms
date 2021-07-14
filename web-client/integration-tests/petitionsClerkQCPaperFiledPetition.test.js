import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkEditsSavedPetition } from './journey/petitionsClerkEditsSavedPetition';
import { petitionsClerkRemovesAndReaddsPdfFromPetition } from './journey/petitionsClerkRemovesAndReaddsPdfFromPetition';
import { petitionsClerkRemovesAndReaddsPetitionFile } from './journey/petitionsClerkRemovesAndReaddsPetitionFile';
import { petitionsClerkReviewsPetitionAndSavesForLater } from './journey/petitionsClerkReviewsPetitionAndSavesForLater';
import { petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving } from './journey/petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving';
import { petitionsClerkViewsSectionInProgress } from './journey/petitionsClerkViewsSectionInProgress';

const cerebralTest = setupTest();

describe('Petitions Clerk QCs Paper Filed Petition', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  petitionsClerkReviewsPetitionAndSavesForLater(cerebralTest);
  petitionsClerkViewsSectionInProgress(cerebralTest);
  petitionsClerkEditsSavedPetition(cerebralTest);
  petitionsClerkRemovesAndReaddsPetitionFile(cerebralTest, fakeFile);
  petitionsClerkEditsSavedPetition(cerebralTest);
  petitionsClerkRemovesAndReaddsPdfFromPetition(cerebralTest, fakeFile);
  petitionsClerkEditsSavedPetition(cerebralTest);
  petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving(
    cerebralTest,
    fakeFile,
  );

  it('should be able to serve the case', async () => {
    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    await cerebralTest.runSequence('openConfirmServeToIrsModalSequence');

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );

    await cerebralTest.runSequence('completePrintPaperPetitionReceiptSequence');
  });
});
