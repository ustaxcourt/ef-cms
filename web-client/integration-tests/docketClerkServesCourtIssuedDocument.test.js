import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCancelsAddDocketEntryFromOrder } from './journey/docketClerkCancelsAddDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkServesDocumentFromCaseDetailDocumentView } from './journey/docketClerkServesDocumentFromCaseDetailDocumentView';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsCaseDetailAfterServingCourtIssuedDocument } from './journey/docketClerkViewsCaseDetailAfterServingCourtIssuedDocument';
import { docketClerkViewsCaseDetailDocumentView } from './journey/docketClerkViewsCaseDetailDocumentView';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { docketClerkViewsSavedCourtIssuedDocketEntryInProgress } from './journey/docketClerkViewsSavedCourtIssuedDocketEntryInProgress';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsDraftOrder } from './journey/petitionsClerkViewsDraftOrder';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  loginAs(test, 'petitioner@example.com');
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);

  loginAs(test, 'docketclerk@example.com');
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
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to Show Cause',
    eventCode: 'OSC',
    expectedDocumentType: 'Order to Show Cause',
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test, 6);
  petitionsClerkViewsDraftOrder(test, 0);
  petitionsClerkPrioritizesCase(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(test, 0);
  docketClerkSignsOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkViewsDraftOrder(test, 1);
  docketClerkCancelsAddDocketEntryFromOrder(test, 1);
  docketClerkViewsDraftOrder(test, 1);
  docketClerkSignsOrder(test, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);
  docketClerkViewsSavedCourtIssuedDocketEntryInProgress(test, 1);
  docketClerkServesDocument(test, 0);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(test, 0);
  docketClerkServesDocument(test, 1);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(test, 1);

  docketClerkViewsDraftOrder(test, 2);
  docketClerkSignsOrder(test, 2);
  docketClerkAddsDocketEntryFromOrder(test, 2);
  docketClerkServesDocumentFromCaseDetailDocumentView(test);
  docketClerkViewsCaseDetailDocumentView(test);
});
