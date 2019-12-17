import { fakeFile, setupTest } from './helpers';

// docketClerk
import docketClerkAddsDocketEntryFromOrder from './journey/docketClerkAddsDocketEntryFromOrder';
import docketClerkAddsDocketEntryFromOrderOfDismissal from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import docketClerkCancelsAddDocketEntryFromOrder from './journey/docketClerkCancelsAddDocketEntryFromOrder';
import docketClerkCreatesAnOrder from './journey/docketClerkCreatesAnOrder';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkServesOrder from './journey/docketClerkServesOrder';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkViewsCaseDetailAfterServingCourtIssuedDocument from './journey/docketClerkViewsCaseDetailAfterServingCourtIssuedDocument';
import docketClerkViewsCaseDetailForCourtIssuedDocketEntry from './journey/docketClerkViewsCaseDetailForCourtIssuedDocketEntry';
import docketClerkViewsDraftOrder from './journey/docketClerkViewsDraftOrder';
import docketClerkViewsSavedCourtIssuedDocketEntryInProgress from './journey/docketClerkViewsSavedCourtIssuedDocketEntryInProgress';
// petitionsClerk
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkViewsDraftOrder from './journey/petitionsClerkViewsDraftOrder';
// petitioner
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionsClerkPrioritizesCase from './journey/petitionsClerkPrioritizesCase';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  petitionerLogin(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerSignsOut(test);

  docketClerkLogIn(test);
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
  docketClerkSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkViewsCaseDetail(test, 4);
  petitionsClerkViewsDraftOrder(test, 0);
  petitionsClerkPrioritizesCase(test);
  petitionsClerkSignsOut(test);

  docketClerkLogIn(test);
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
  docketClerkSignsOut(test);
});
