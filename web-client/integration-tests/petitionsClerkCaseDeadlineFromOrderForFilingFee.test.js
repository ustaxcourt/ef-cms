import { PAYMENT_STATUS } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkReviewsPaperCaseBeforeServing } from './journey/petitionsClerkReviewsPaperCaseBeforeServing';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Petitions Clerk something', () => {
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
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile, {
    paymentStatus: PAYMENT_STATUS.UNPAID,
  });
  petitionsClerkReviewsPaperCaseBeforeServing(cerebralTest, {
    paymentStatus: PAYMENT_STATUS.UNPAID,
  });

  petitionsClerkServesPetitionFromDocumentView(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(cerebralTest, 0);
  docketClerkSignsOrder(cerebralTest, 0);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);

  //create a new paper case with filing fee not paid
  //serve the case
  //verify OF in drafts
  //sign OF
  //add docket entry from OF
  //serve docket entry
  //verify there is a new case deadline with date from previous step and correct description

  //create a new paper case with filing fee not paid
  //serve the case
  //sign OF
  //add docket entry from OF
  //save for later
  //serve docket entry from document viewer
  //verify there is a new case deadline with date from previous step and correct description
});
