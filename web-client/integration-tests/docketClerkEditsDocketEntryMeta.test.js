import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

// docketClerk
import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsDocketEntryMeta } from './journey/docketClerkEditsDocketEntryMeta';
import { docketClerkNavigatesToEditDocketEntryMeta } from './journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkNavigatesToEditDocketEntryMetaCourtIssued } from './journey/docketClerkNavigatesToEditDocketEntryMetaCourtIssued';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkServesOrder } from './journey/docketClerkServesOrder';
import { docketClerkVerifiesDocketEntryMetaUpdates } from './journey/docketClerkVerifiesDocketEntryMetaUpdates';
import { docketClerkVerifiesEditCourtIssuedNonstandardFields } from './journey/docketClerkVerifiesEditCourtIssuedNonstandardFields';

// petitioner
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkEditsDocketEntryMetaCourtIssued } from './journey/docketClerkEditsDocketEntryMetaCourtIssued';
import { docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates } from './journey/docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates';
import { docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge } from './journey/docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
test.draftOrders = [];

describe("Docket Clerk Edits a Docket Entry's Meta", () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });
  petitionerFilesADocumentForCase(test, fakeFile);

  loginAs(test, 'docketclerk');
  docketClerkChecksDocketEntryEditLink(test);
  docketClerkQCsDocketEntry(test);
  docketClerkChecksDocketEntryEditLink(test, { value: true });

  docketClerkNavigatesToEditDocketEntryMeta(test, 3);
  docketClerkEditsDocketEntryMeta(test);
  docketClerkVerifiesDocketEntryMetaUpdates(test, 3);

  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesOrder(test, 0);
  docketClerkNavigatesToEditDocketEntryMetaCourtIssued(test, 4);
  docketClerkEditsDocketEntryMetaCourtIssued(test);
  docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates(test, 4);
  docketClerkNavigatesToEditDocketEntryMetaCourtIssued(test, 4);
  docketClerkVerifiesEditCourtIssuedNonstandardFields(test);

  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);
  docketClerkServesOrder(test, 1);
  docketClerkNavigatesToEditDocketEntryMetaCourtIssued(test, 5);
  docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge(test);
});
