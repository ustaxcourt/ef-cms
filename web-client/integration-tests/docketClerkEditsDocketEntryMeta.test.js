import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsDocketEntryMeta } from './journey/docketClerkEditsDocketEntryMeta';
import { docketClerkEditsDocketEntryMetaCourtIssued } from './journey/docketClerkEditsDocketEntryMetaCourtIssued';
import { docketClerkEditsDocketEntryMetaMinuteEntry } from './journey/docketClerkEditsDocketEntryMetaMinuteEntry';
import { docketClerkEditsDocketEntryMetaWithNewFreeText } from './journey/docketClerkEditsDocketEntryMetaWithNewFreeText';
import { docketClerkNavigatesToEditDocketEntryMeta } from './journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkNavigatesToEditDocketEntryMetaCourtIssued } from './journey/docketClerkNavigatesToEditDocketEntryMetaCourtIssued';
import { docketClerkNavigatesToEditDocketEntryMetaMinuteEntry } from './journey/docketClerkNavigatesToEditDocketEntryMetaMinuteEntry';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates } from './journey/docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates';
import { docketClerkVerifiesDocketEntryMetaUpdates } from './journey/docketClerkVerifiesDocketEntryMetaUpdates';
import { docketClerkVerifiesDocketEntryMetaUpdatesInEditForm } from './journey/docketClerkVerifiesDocketEntryMetaUpdatesInEditForm';
import { docketClerkVerifiesDocketEntryMetaUpdatesMinuteEntry } from './journey/docketClerkVerifiesDocketEntryMetaUpdatesMinuteEntry';
import { docketClerkVerifiesEditCourtIssuedNonstandardFields } from './journey/docketClerkVerifiesEditCourtIssuedNonstandardFields';
import { docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge } from './journey/docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { irsSuperuserGetsReconciliationReport } from './journey/irsSuperuserGetsReconciliationReport';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';
import { petitionerFilesApplicationToTakeDeposition } from './journey/petitionerFilesApplicationToTakeDeposition';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';

describe("Docket Clerk Edits a Docket Entry's Meta", () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner creates electronic case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerFilesADocumentForCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(cerebralTest);
  docketClerkQCsDocketEntry(cerebralTest);
  docketClerkChecksDocketEntryEditLink(cerebralTest, { value: true });

  // edit docket entry meta for a minute entry
  docketClerkNavigatesToEditDocketEntryMetaMinuteEntry(cerebralTest);
  docketClerkEditsDocketEntryMetaMinuteEntry(cerebralTest);
  docketClerkVerifiesDocketEntryMetaUpdatesMinuteEntry(cerebralTest);
  docketClerkNavigatesToEditDocketEntryMetaMinuteEntry(cerebralTest);

  docketClerkNavigatesToEditDocketEntryMeta(cerebralTest, 4);
  docketClerkEditsDocketEntryMeta(cerebralTest, 4, {
    filedBy: 'Resp. & Petr. Mona Schultz, Brianna Noble',
  });
  docketClerkVerifiesDocketEntryMetaUpdates(cerebralTest, 4);
  docketClerkNavigatesToEditDocketEntryMeta(cerebralTest, 4);
  docketClerkVerifiesDocketEntryMetaUpdatesInEditForm(cerebralTest);

  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);
  docketClerkNavigatesToEditDocketEntryMetaCourtIssued(cerebralTest, 5);
  docketClerkEditsDocketEntryMetaCourtIssued(cerebralTest, 5);
  docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates(cerebralTest, 5);
  docketClerkNavigatesToEditDocketEntryMetaCourtIssued(cerebralTest, 5);
  docketClerkVerifiesEditCourtIssuedNonstandardFields(cerebralTest);

  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrderOfDismissal(cerebralTest, 1);
  docketClerkServesDocument(cerebralTest, 1);
  docketClerkNavigatesToEditDocketEntryMetaCourtIssued(cerebralTest, 6);
  docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerFilesApplicationToTakeDeposition(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkNavigatesToEditDocketEntryMeta(cerebralTest, 7);
  docketClerkEditsDocketEntryMetaWithNewFreeText(cerebralTest, 7);

  irsSuperuserGetsReconciliationReport(cerebralTest);
});
