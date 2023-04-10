import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerk1ServesCourtIssuedDocumentFromMessageDetail } from './journey/petitionsClerk1ServesCourtIssuedDocumentFromMessageDetail';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';
import { petitionsClerkClicksCaseDetailTabFromMessageDetail } from './journey/petitionsClerkClicksCaseDetailTabFromMessageDetail';

describe('Petitions Clerk Serves Court Issued Document From Message Detail', () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];

  beforeAll(() => {
    jest.spyOn(
      cerebralTest.applicationContext.getUseCases(),
      'createMessageInteractor',
    );
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });

  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  createNewMessageOnCase(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(cerebralTest);
  petitionsClerk1ViewsMessageDetail(cerebralTest);
  petitionsClerk1ServesCourtIssuedDocumentFromMessageDetail(cerebralTest);
  petitionsClerkClicksCaseDetailTabFromMessageDetail(cerebralTest);
});
