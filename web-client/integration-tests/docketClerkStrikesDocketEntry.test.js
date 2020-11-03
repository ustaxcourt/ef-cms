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

const test = setupTest();
test.draftOrders = [];
console.error = () => null;

describe("Docket Clerk Edits a Docket Entry's Meta", () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });
  petitionerFilesADocumentForCase(test, fakeFile);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(test);
  docketClerkQCsDocketEntry(test);
  docketClerkChecksDocketEntryEditLink(test, { value: true });

  docketClerkNavigatesToEditDocketEntryMeta(test, 3);
  docketClerkStrikesDocketEntry(test, 3);

  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order that is stricken',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesDocument(test, 0);
  docketClerkNavigatesToEditDocketEntryMetaForCourtIssued(test, 4);
  docketClerkStrikesDocketEntry(test, 4);

  loginAs(test, 'privatePractitioner@example.com');
  practitionerViewsCaseDetail(test, false);
  privatePractitionerSeesStrickenDocketEntry(test, 4);
  privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully(test);
  userSearchesForStrickenDocument(test);

  loginAs(test, 'docketclerk@example.com');
  userSearchesForStrickenDocument(test);
});
