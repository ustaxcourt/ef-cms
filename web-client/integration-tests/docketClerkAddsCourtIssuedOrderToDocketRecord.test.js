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
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { docketClerkViewsSavedCourtIssuedDocketEntryInProgress } from './journey/docketClerkViewsSavedCourtIssuedDocketEntryInProgress';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsDocketEntry } from './journey/petitionsClerkViewsDocketEntry';
import { petitionsClerkViewsDraftOrder } from './journey/petitionsClerkViewsDraftOrder';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
test.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsCaseDetail(test, 4);
  petitionsClerkViewsDraftOrder(test, 0);

  loginAs(test, 'docketclerk');
  docketClerkViewsDraftOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkEditsDocketEntryFromOrderTypeA(test, 0);
  docketClerkConvertsAnOrderToAnOpinion(test, 0);
  docketClerkEditsDocketEntryFromOrderTypeC(test, 0);
  docketClerkEditsDocketEntryFromOrderTypeD(test, 0);
  docketClerkEditsDocketEntryFromOrderTypeE(test, 0);
  docketClerkEditsDocketEntryFromOrderTypeF(test, 0);
  docketClerkEditsDocketEntryFromOrderTypeG(test, 0);
  docketClerkEditsDocketEntryFromOrderTypeH(test, 0);
  docketClerkViewsDraftOrder(test, 1);
  docketClerkCancelsAddDocketEntryFromOrder(test, 1);
  docketClerkViewsDraftOrder(test, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);
  docketClerkViewsSavedCourtIssuedDocketEntryInProgress(test, 1);
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkAddsDocketEntryFromOrderWithDate(test, 2);

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsDocketEntry(test, 1);

  loginAs(test, 'petitioner');
  petitionerViewsCaseDetail(test, {
    docketNumberSuffix: 'L',
    documentCount: 5,
  });
});
