import {
  fakeFile,
  loginAs,
  setupTest,
  waitForLoadingComponentToHide,
  waitForModalsToHide,
} from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkEditsSavedPetition } from './journey/petitionsClerkEditsSavedPetition';
import { petitionsClerkRemovesAndReaddsPdfFromPetition } from './journey/petitionsClerkRemovesAndReaddsPdfFromPetition';
import { petitionsClerkRemovesAndReaddsPetitionFile } from './journey/petitionsClerkRemovesAndReaddsPetitionFile';
import { petitionsClerkReviewsPaperCaseBeforeServing } from './journey/petitionsClerkReviewsPaperCaseBeforeServing';
import { petitionsClerkReviewsPetitionAndSavesForLater } from './journey/petitionsClerkReviewsPetitionAndSavesForLater';
import { petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving } from './journey/petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving';
import { petitionsClerkViewsSectionInProgress } from './journey/petitionsClerkViewsSectionInProgress';

describe('Petitions Clerk QCs Paper Filed Petition', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  petitionsClerkReviewsPaperCaseBeforeServing(cerebralTest, {
    hasIrsNoticeFormatted: 'No',
    ordersAndNoticesInDraft: ['Order Designating Place of Trial'],
    ordersAndNoticesNeeded: ['Order for Ratification of Petition'],
    petitionPaymentStatusFormatted: 'Waived 05/05/05',
    receivedAtFormatted: '01/01/01',
    shouldShowIrsNoticeDate: false,
  });
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

    await waitForLoadingComponentToHide({ cerebralTest });
    await waitForModalsToHide({ cerebralTest, maxWait: 120000 });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );

    await cerebralTest.runSequence('completePrintPaperPetitionReceiptSequence');
  });
});
