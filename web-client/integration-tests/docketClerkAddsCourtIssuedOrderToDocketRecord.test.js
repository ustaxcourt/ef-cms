import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkAddsDocketEntryFromOrderWithDate } from './journey/docketClerkAddsDocketEntryFromOrderWithDate';
import { docketClerkCancelsAddDocketEntryFromOrder } from './journey/docketClerkCancelsAddDocketEntryFromOrder';
import { docketClerkConvertsAnOrderToAnOpinion } from './journey/docketClerkConvertsAnOrderToAnOpinion';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsDocketEntryFromOrderTypeA } from './journey/docketClerkEditsDocketEntryFromOrderTypeA';
import { docketClerkEditsDocketEntryFromOrderTypeC } from './journey/docketClerkEditsDocketEntryFromOrderTypeC';
import { docketClerkEditsDocketEntryFromOrderTypeD } from './journey/docketClerkEditsDocketEntryFromOrderTypeD';
import { docketClerkEditsDocketEntryFromOrderTypeE } from './journey/docketClerkEditsDocketEntryFromOrderTypeE';
import { docketClerkEditsDocketEntryFromOrderTypeF } from './journey/docketClerkEditsDocketEntryFromOrderTypeF';
import { docketClerkEditsDocketEntryFromOrderTypeG } from './journey/docketClerkEditsDocketEntryFromOrderTypeG';
import { docketClerkEditsDocketEntryFromOrderTypeH } from './journey/docketClerkEditsDocketEntryFromOrderTypeH';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { docketClerkViewsSavedCourtIssuedDocketEntryInProgress } from './journey/docketClerkViewsSavedCourtIssuedDocketEntryInProgress';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsDocketEntry } from './journey/petitionsClerkViewsDocketEntry';
import { petitionsClerkViewsDraftOrder } from './journey/petitionsClerkViewsDraftOrder';

const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();
const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
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

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest, 5);
  petitionsClerkViewsDraftOrder(cerebralTest, 0);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(cerebralTest, 0);
  docketClerkSignsOrder(cerebralTest, 0);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeA(cerebralTest, 0);
  docketClerkConvertsAnOrderToAnOpinion(cerebralTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeC(cerebralTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeD(cerebralTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeE(cerebralTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeF(cerebralTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeG(cerebralTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeH(cerebralTest, 0);
  docketClerkViewsDraftOrder(cerebralTest, 1);
  docketClerkCancelsAddDocketEntryFromOrder(cerebralTest, 1);
  docketClerkViewsDraftOrder(cerebralTest, 1);
  docketClerkSignsOrder(cerebralTest, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(cerebralTest, 1);
  docketClerkViewsSavedCourtIssuedDocketEntryInProgress(cerebralTest, 1);
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(cerebralTest, 2);
  docketClerkAddsDocketEntryFromOrderWithDate(cerebralTest, 2);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsDocketEntry(cerebralTest, 1);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsCaseDetail(cerebralTest, {
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
    documentCount: 5,
  });
});
