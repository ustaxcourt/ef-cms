import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerk1ServesPetitionFromMessageDetail } from './journey/petitionsClerk1ServesPetitionFromMessageDetail';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkReviewsPaperCaseBeforeServing } from './journey/petitionsClerkReviewsPaperCaseBeforeServing';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Petitions Clerk Serves Paper Petition From Message Detail & Document View', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
    jest.spyOn(
      cerebralTest.applicationContext.getUseCases(),
      'createMessageInteractor',
    );
  });

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
  createNewMessageOnCase(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(cerebralTest);
  petitionsClerk1ViewsMessageDetail(cerebralTest);
  petitionsClerk1ServesPetitionFromMessageDetail(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);
});
