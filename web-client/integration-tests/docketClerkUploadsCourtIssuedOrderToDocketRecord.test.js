import { docketClerkAddsDocketEntryForNoticeFromDraft } from './journey/docketClerkAddsDocketEntryForNoticeFromDraft';
import { docketClerkAddsDocketEntryFromDraft } from './journey/docketClerkAddsDocketEntryFromDraft';
import { docketClerkEditsAnUploadedCourtIssuedDocument } from './journey/docketClerkEditsAnUploadedCourtIssuedDocument';
import { docketClerkEditsSignedUploadedCourtIssuedDocument } from './journey/docketClerkEditsSignedUploadedCourtIssuedDocument';
import { docketClerkRemovesSignatureFromUploadedCourtIssuedDocument } from './journey/docketClerkRemovesSignatureFromUploadedCourtIssuedDocument';
import { docketClerkSignsUploadedCourtIssuedDocument } from './journey/docketClerkSignsUploadedCourtIssuedDocument';
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

describe('Docket Clerk Uploads Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    test.draftOrders = [];
  });

  loginAs(test, 'petitioner@example.com');
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);

  loginAs(test, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(test, fakeFile);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test, 4);
  petitionsClerkViewsDraftOrder(test, 0);

  loginAs(test, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(test, 0);
  docketClerkEditsAnUploadedCourtIssuedDocument(test, fakeFile, 0);
  docketClerkSignsUploadedCourtIssuedDocument(test);
  docketClerkEditsSignedUploadedCourtIssuedDocument(test, fakeFile);
  docketClerkSignsUploadedCourtIssuedDocument(test);
  docketClerkRemovesSignatureFromUploadedCourtIssuedDocument(test);
  docketClerkAddsDocketEntryFromDraft(test, 0);

  loginAs(test, 'petitioner@example.com');
  petitionerViewsCaseDetail(test, { documentCount: 3 });

  loginAs(test, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(test, fakeFile);
  docketClerkViewsDraftOrder(test, 2);
  docketClerkAddsDocketEntryForNoticeFromDraft(test, 2);

  loginAs(test, 'petitioner@example.com');
  petitionerViewsCaseDetail(test, { documentCount: 4 });
});
