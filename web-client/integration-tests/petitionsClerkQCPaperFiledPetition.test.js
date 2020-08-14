import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkEditsSavedPetition } from './journey/petitionsClerkEditsSavedPetition';
import { petitionsClerkRemovesAndReaddsPdfFromPetition } from './journey/petitionsClerkRemovesAndReaddsPdfFromPetition';
import { petitionsClerkRemovesAndReaddsPetitionFile } from './journey/petitionsClerkRemovesAndReaddsPetitionFile';
import { petitionsClerkReviewsPetitionAndSavesForLater } from './journey/petitionsClerkReviewsPetitionAndSavesForLater';
import { petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving } from './journey/petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving';
import { petitionsClerkViewsSectionInProgress } from './journey/petitionsClerkViewsSectionInProgress';

const test = setupTest();

describe('Petitions Clerk QCs Paper Filed Petition', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(test, fakeFile);
  petitionsClerkReviewsPetitionAndSavesForLater(test);
  petitionsClerkViewsSectionInProgress(test);
  petitionsClerkEditsSavedPetition(test);
  petitionsClerkRemovesAndReaddsPetitionFile(test, fakeFile);
  petitionsClerkEditsSavedPetition(test);
  petitionsClerkRemovesAndReaddsPdfFromPetition(test, fakeFile);
  petitionsClerkEditsSavedPetition(test);
  petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving(test, fakeFile);

  it('should be able to serve the case', async () => {
    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');

    await test.runSequence('openConfirmServeToIrsModalSequence');

    await test.runSequence('serveCaseToIrsSequence');

    expect(test.getState('currentPage')).toEqual('PrintPaperPetitionReceipt');

    await test.runSequence('completePrintPaperPetitionReceiptSequence');
  });
});
