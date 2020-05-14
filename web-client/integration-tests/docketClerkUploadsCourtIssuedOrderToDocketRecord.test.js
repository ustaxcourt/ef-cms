import { fakeFile, loginAs, setupTest } from './helpers';

// docketClerk
import { docketClerkAddsDocketEntryFromDraft } from './journey/docketClerkAddsDocketEntryFromDraft';
import { docketClerkEditsAnUploadedCourtIssuedDocument } from './journey/docketClerkEditsAnUploadedCourtIssuedDocument';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { docketClerkViewsCaseDetailForCourtIssuedDocketEntry } from './journey/docketClerkViewsCaseDetailForCourtIssuedDocketEntry';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
// petitionsClerk
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsDraftOrder } from './journey/petitionsClerkViewsDraftOrder';
// petitioner
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Uploads Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);

  loginAs(test, 'docketclerk');
  docketClerkUploadsACourtIssuedDocument(test, fakeFile);

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsCaseDetail(test, 3);
  petitionsClerkViewsDraftOrder(test, 0);

  loginAs(test, 'docketclerk');
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkViewsDraftOrder(test, 0);
  docketClerkEditsAnUploadedCourtIssuedDocument(test, fakeFile, 0);
  docketClerkAddsDocketEntryFromDraft(test, 0);
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);

  loginAs(test, 'petitioner');
  petitionerViewsCaseDetail(test, { documentCount: 3 });
});
