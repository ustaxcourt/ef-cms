import { docketClerkAddsDocketEntryFromDraft } from './journey/docketClerkAddsDocketEntryFromDraft';
import { docketClerkEditsAnUploadedCourtIssuedDocument } from './journey/docketClerkEditsAnUploadedCourtIssuedDocument';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsDraftOrder } from './journey/petitionsClerkViewsDraftOrder';

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
  docketClerkViewsDraftOrder(test, 0);
  docketClerkEditsAnUploadedCourtIssuedDocument(test, fakeFile, 0);
  docketClerkAddsDocketEntryFromDraft(test, 0);

  loginAs(test, 'petitioner');
  petitionerViewsCaseDetail(test, { documentCount: 3 });
});
