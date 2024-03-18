import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCancelsAddDocketEntryFromOrder } from './journey/docketClerkCancelsAddDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkGetsDocketEntryByEventCode } from './journey/docketClerkGetsDocketEntryByEventCode';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkServesDocumentFromCaseDetailDocumentView } from './journey/docketClerkServesDocumentFromCaseDetailDocumentView';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsCaseDetailAfterServingCourtIssuedDocument } from './journey/docketClerkViewsCaseDetailAfterServingCourtIssuedDocument';
import { docketClerkViewsCaseDetailDocumentView } from './journey/docketClerkViewsCaseDetailDocumentView';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { docketClerkViewsSavedCourtIssuedDocketEntryInProgress } from './journey/docketClerkViewsSavedCourtIssuedDocketEntryInProgress';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsDraftOrder } from './journey/petitionsClerkViewsDraftOrder';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      procedureType: 'Regular',
    });
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
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to Show Cause',
    eventCode: 'OSC',
    expectedDocumentType: 'Order to Show Cause',
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest, 6);
  petitionsClerkViewsDraftOrder(cerebralTest, 0);
  petitionsClerkPrioritizesCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkGetsDocketEntryByEventCode(cerebralTest, 'O');
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);

  docketClerkGetsDocketEntryByEventCode(cerebralTest, 'OD');
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkCancelsAddDocketEntryFromOrder(cerebralTest, 1);
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrderOfDismissal(cerebralTest, 1);
  docketClerkViewsSavedCourtIssuedDocketEntryInProgress(cerebralTest, 1);
  docketClerkServesDocument(cerebralTest, 0);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 1);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(cerebralTest, 1);

  docketClerkGetsDocketEntryByEventCode(cerebralTest, 'OSC');
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 2);
  docketClerkServesDocumentFromCaseDetailDocumentView(cerebralTest);
  docketClerkViewsCaseDetailDocumentView(cerebralTest);
});
