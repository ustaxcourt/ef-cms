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

describe('Docket Clerk Strikes a Docket Entry', () => {
  const cerebralTest = setupTest();

  console.error = () => null;

  afterAll(() => {
    cerebralTest.closeSocket();
    cerebralTest.draftOrders = [];
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner creates an electronic case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerFilesADocumentForCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(cerebralTest, {
    index: 2,
    value: false,
  });
  docketClerkQCsDocketEntry(cerebralTest, { index: 2 });
  docketClerkChecksDocketEntryEditLink(cerebralTest, { value: true });

  docketClerkNavigatesToEditDocketEntryMeta(cerebralTest, 4);
  docketClerkStrikesDocketEntry(cerebralTest, 4);

  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order that is stricken',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);
  docketClerkNavigatesToEditDocketEntryMetaForCourtIssued(cerebralTest, 5);
  docketClerkStrikesDocketEntry(cerebralTest, 5);

  loginAs(cerebralTest, 'privatepractitioner@example.com');
  practitionerViewsCaseDetail(cerebralTest, false);
  privatePractitionerSeesStrickenDocketEntry(cerebralTest, 5);
  privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully(cerebralTest);
  userSearchesForStrickenDocument(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  userSearchesForStrickenDocument(cerebralTest);
});
