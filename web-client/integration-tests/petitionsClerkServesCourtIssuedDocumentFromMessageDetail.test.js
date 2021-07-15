import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerk1ServesDocumentFromMessageDetail } from './journey/petitionsClerk1ServesDocumentFromMessageDetail';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';
import { petitionsClerkClicksCaseDetailTabFromMessageDetail } from './journey/petitionsClerkClicksCaseDetailTabFromMessageDetail';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Petitions Clerk Serves Court Issued Document From Message Detail', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
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
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });

  docketClerkViewsDraftOrder(cerebralTest, 0);
  docketClerkSignsOrder(cerebralTest, 0);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  createNewMessageOnCase(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(cerebralTest);
  petitionsClerk1ViewsMessageDetail(cerebralTest);
  petitionsClerk1ServesDocumentFromMessageDetail(cerebralTest);
  petitionsClerkClicksCaseDetailTabFromMessageDetail(cerebralTest);
});
