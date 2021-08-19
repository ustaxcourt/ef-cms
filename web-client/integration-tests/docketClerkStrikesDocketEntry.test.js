import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkNavigatesToEditDocketEntryMeta } from './journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkNavigatesToEditDocketEntryMetaForCourtIssued } from './journey/docketClerkNavigatesToEditDocketEntryMetaForCourtIssued';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkStrikesDocketEntry } from './journey/docketClerkStrikesDocketEntry';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerViewsCaseDetail } from './journey/practitionerViewsCaseDetail';
import { privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully } from './journey/privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully';
import { privatePractitionerSeesStrickenDocketEntry } from './journey/privatePractitionerSeesStrickenDocketEntry';
import { userSearchesForStrickenDocument } from './journey/userSearchesForStrickenDocument';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];
console.error = () => null;

describe("Docket Clerk Edits a Docket Entry's Meta", () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });
  petitionerFilesADocumentForCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(cerebralTest);
  docketClerkQCsDocketEntry(cerebralTest);
  docketClerkChecksDocketEntryEditLink(cerebralTest, { value: true });

  docketClerkNavigatesToEditDocketEntryMeta(cerebralTest, 3);
  docketClerkStrikesDocketEntry(cerebralTest, 3);

  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order that is stricken',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest, 0);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);
  docketClerkNavigatesToEditDocketEntryMetaForCourtIssued(cerebralTest, 4);
  docketClerkStrikesDocketEntry(cerebralTest, 4);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  practitionerViewsCaseDetail(cerebralTest, false);
  privatePractitionerSeesStrickenDocketEntry(cerebralTest, 4);
  privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully(cerebralTest);
  userSearchesForStrickenDocument(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  userSearchesForStrickenDocument(cerebralTest);
});
