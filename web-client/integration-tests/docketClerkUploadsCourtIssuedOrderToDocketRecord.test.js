import { fakeFile, setupTest } from './helpers';

// docketClerk
import docketClerkAddsDocketEntryFromDraft from './journey/docketClerkAddsDocketEntryFromDraft';
import docketClerkEditsAnUploadedCourtIssuedDocument from './journey/docketClerkEditsAnUploadedCourtIssuedDocument';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkUploadsACourtIssuedDocument from './journey/docketClerkUploadsACourtIssuedDocument';
import docketClerkViewsCaseDetailForCourtIssuedDocketEntry from './journey/docketClerkViewsCaseDetailForCourtIssuedDocketEntry';
import docketClerkViewsDraftOrder from './journey/docketClerkViewsDraftOrder';
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
import petitionerViewsCaseDetail from './journey/petitionerViewsCaseDetail';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Uploads Court-Issued Order to Docket Record', () => {
  petitionerLogin(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerSignsOut(test);

  docketClerkLogIn(test);
  docketClerkUploadsACourtIssuedDocument(test, fakeFile);
  docketClerkSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkViewsCaseDetail(test, 3);
  petitionsClerkViewsDraftOrder(test, 0);
  petitionsClerkSignsOut(test);

  docketClerkLogIn(test);
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkViewsDraftOrder(test, 0);
  docketClerkEditsAnUploadedCourtIssuedDocument(test, fakeFile, 0);
  docketClerkAddsDocketEntryFromDraft(test, 0);
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkSignsOut(test);

  petitionerLogin(test);
  petitionerViewsCaseDetail(test, { documentCount: 3 });
  petitionerSignsOut(test);
});
