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

const cerebralTest = setupTest();

describe('Docket Clerk Uploads Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerChoosesProcedureType(cerebralTest, { procedureType: 'Regular' });
  petitionerChoosesCaseType(cerebralTest);
  petitionerCreatesNewCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest, 4);
  petitionsClerkViewsDraftOrder(cerebralTest, 0);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(cerebralTest, 0);
  docketClerkEditsAnUploadedCourtIssuedDocument(cerebralTest, fakeFile, 0);
  docketClerkSignsUploadedCourtIssuedDocument(cerebralTest);
  docketClerkEditsSignedUploadedCourtIssuedDocument(cerebralTest, fakeFile);
  docketClerkSignsUploadedCourtIssuedDocument(cerebralTest);
  docketClerkRemovesSignatureFromUploadedCourtIssuedDocument(cerebralTest);
  docketClerkAddsDocketEntryFromDraft(cerebralTest, 0);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsCaseDetail(cerebralTest, { documentCount: 3 });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);
  docketClerkViewsDraftOrder(cerebralTest, 2);
  docketClerkAddsDocketEntryForNoticeFromDraft(cerebralTest, 2);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsCaseDetail(cerebralTest, { documentCount: 4 });
});
