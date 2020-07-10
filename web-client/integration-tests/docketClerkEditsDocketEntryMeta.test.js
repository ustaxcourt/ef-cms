import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsDocketEntryMeta } from './journey/docketClerkEditsDocketEntryMeta';
import { docketClerkEditsDocketEntryMetaCourtIssued } from './journey/docketClerkEditsDocketEntryMetaCourtIssued';
import { docketClerkNavigatesToEditDocketEntryMeta } from './journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkNavigatesToEditDocketEntryMetaCourtIssued } from './journey/docketClerkNavigatesToEditDocketEntryMetaCourtIssued';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates } from './journey/docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates';
import { docketClerkVerifiesDocketEntryMetaUpdates } from './journey/docketClerkVerifiesDocketEntryMetaUpdates';
import { docketClerkVerifiesEditCourtIssuedNonstandardFields } from './journey/docketClerkVerifiesEditCourtIssuedNonstandardFields';
import { docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge } from './journey/docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
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
    global.window.pdfjsObj = {
      getData: () => Promise.resolve(new Uint8Array(fakeFile)),
    };
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });
  petitionerFilesADocumentForCase(test, fakeFile);

  loginAs(test, 'docketclerk@example.com');
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
  docketClerkSignsOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesDocument(test, 0);
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
  docketClerkSignsOrder(test, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);
  docketClerkServesDocument(test, 1);
  docketClerkNavigatesToEditDocketEntryMetaCourtIssued(test, 5);
  docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge(test);
});
