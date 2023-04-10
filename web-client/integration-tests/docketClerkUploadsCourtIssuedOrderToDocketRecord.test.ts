import { docketClerkAddsDocketEntryForNoticeFromDraft } from './journey/docketClerkAddsDocketEntryForNoticeFromDraft';
import { docketClerkAddsDocketEntryFromDraft } from './journey/docketClerkAddsDocketEntryFromDraft';
import { docketClerkEditsAnUploadedCourtIssuedDocument } from './journey/docketClerkEditsAnUploadedCourtIssuedDocument';
import { docketClerkEditsSignedUploadedCourtIssuedDocument } from './journey/docketClerkEditsSignedUploadedCourtIssuedDocument';
import { docketClerkRemovesSignatureFromUploadedCourtIssuedDocument } from './journey/docketClerkRemovesSignatureFromUploadedCourtIssuedDocument';
import { docketClerkSignsUploadedCourtIssuedDocument } from './journey/docketClerkSignsUploadedCourtIssuedDocument';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsDraftOrder } from './journey/petitionsClerkViewsDraftOrder';

describe('Docket Clerk Uploads Court-Issued Order to Docket Record', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      caseType: 'Whistleblower',
      procedureType: 'Regular',
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest, 4);
  petitionsClerkViewsDraftOrder(cerebralTest, 0);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(cerebralTest);
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
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkAddsDocketEntryForNoticeFromDraft(cerebralTest, 2);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsCaseDetail(cerebralTest, { documentCount: 4 });
});
