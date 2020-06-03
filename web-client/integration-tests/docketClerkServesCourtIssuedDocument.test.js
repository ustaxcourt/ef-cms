import { fakeFile, loginAs, setupTest } from './helpers';

// docketClerk
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCancelsAddDocketEntryFromOrder } from './journey/docketClerkCancelsAddDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesOrder } from './journey/docketClerkServesOrder';
import { docketClerkViewsCaseDetailAfterServingCourtIssuedDocument } from './journey/docketClerkViewsCaseDetailAfterServingCourtIssuedDocument';
import { docketClerkViewsCaseDetailForCourtIssuedDocketEntry } from './journey/docketClerkViewsCaseDetailForCourtIssuedDocketEntry';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { docketClerkViewsSavedCourtIssuedDocketEntryInProgress } from './journey/docketClerkViewsSavedCourtIssuedDocketEntryInProgress';
// petitionsClerk
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkViewsDraftOrder from './journey/petitionsClerkViewsDraftOrder';
// petitioner
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import petitionsClerkPrioritizesCase from './journey/petitionsClerkPrioritizesCase';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
test.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  loginAs(test, 'petitioner');
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);

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
  petitionsClerkPrioritizesCase(test);

  loginAs(test, 'docketclerk');
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkViewsDraftOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkViewsDraftOrder(test, 1);
  docketClerkCancelsAddDocketEntryFromOrder(test, 1);
  docketClerkViewsDraftOrder(test, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkViewsSavedCourtIssuedDocketEntryInProgress(test, 1);
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkServesOrder(test, 0);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(test, 0);
  docketClerkServesOrder(test, 1);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(test, 1);
});
