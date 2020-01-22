import { fakeFile, setupTest } from './helpers';

// docketClerk
import docketClerkAddsDocketEntryFromOrder from './journey/docketClerkAddsDocketEntryFromOrder';
import docketClerkCreatesAnOrder from './journey/docketClerkCreatesAnOrder';
import docketClerkEditsDocketEntryMeta from './journey/docketClerkEditsDocketEntryMeta';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkVerifiesDocketEntryMetaUpdates from './journey/docketClerkVerifiesDocketEntryMetaUpdates';
import docketClerkViewsCaseDetailForCourtIssuedDocketEntry from './journey/docketClerkViewsCaseDetailForCourtIssuedDocketEntry';
import docketClerkViewsDraftOrder from './journey/docketClerkViewsDraftOrder';
// petitioner
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerSignsOut from './journey/petitionerSignsOut';

const test = setupTest();
test.draftOrders = [];

describe("Docket Clerk Edits a Docket Entry's Meta", () => {
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
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkViewsDraftOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkEditsDocketEntryMeta(test);
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkVerifiesDocketEntryMetaUpdates(test);
  docketClerkSignsOut(test);
});
