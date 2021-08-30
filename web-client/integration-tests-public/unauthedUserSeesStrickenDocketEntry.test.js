import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkChecksDocketEntryEditLink } from '../integration-tests/journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkNavigatesToEditDocketEntryMeta } from '../integration-tests/journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkNavigatesToEditDocketEntryMetaForCourtIssued } from '../integration-tests/journey/docketClerkNavigatesToEditDocketEntryMetaForCourtIssued';
import { docketClerkQCsDocketEntry } from '../integration-tests/journey/docketClerkQCsDocketEntry';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import { docketClerkStrikesDocketEntry } from '../integration-tests/journey/docketClerkStrikesDocketEntry';
import {
  fakeFile,
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionerFilesADocumentForCase } from '../integration-tests/journey/petitionerFilesADocumentForCase';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';
import { unauthedUserAttemptsToViewStrickenDocumentUnsuccessfully } from './journey/unauthedUserAttemptsToViewStrickenDocumentUnsuccessfully';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesByDocketNumber } from './journey/unauthedUserSearchesByDocketNumber';
import { unauthedUserSearchesForStrickenOrder } from './journey/unauthedUserSearchesForStrickenOrder';
import { unauthedUserSeesStrickenDocketEntry } from './journey/unauthedUserSeesStrickenDocketEntry';

const cerebralTest = setupTest();
const testClient = setupTestClient();
testClient.draftOrders = [];

describe('Petitioner creates a case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(testClient, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(testClient);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
  });
});

describe('Petitions clerk serves case to IRS', () => {
  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);
});

describe('Petitioner files a document for the case', () => {
  loginAs(testClient, 'petitioner@example.com');
  petitionerFilesADocumentForCase(testClient, fakeFile);
});

describe('Docketclerk QCs and Strikes a docket entry', () => {
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(testClient);
  docketClerkQCsDocketEntry(testClient);
  docketClerkChecksDocketEntryEditLink(testClient, { value: true });
  docketClerkNavigatesToEditDocketEntryMeta(testClient, 3);
  docketClerkStrikesDocketEntry(testClient, 3);
});

describe('Unauthed user views stricken docket entry for externally-filed document', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserSearchesByDocketNumber(cerebralTest, testClient);
  unauthedUserSeesStrickenDocketEntry(cerebralTest, 3);
  unauthedUserAttemptsToViewStrickenDocumentUnsuccessfully(cerebralTest);
});

describe('Docketclerk creates an order and strikes it', () => {
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order that is stricken',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(testClient, 0);
  docketClerkAddsDocketEntryFromOrder(testClient, 0);
  docketClerkServesDocument(testClient, 0);
  docketClerkNavigatesToEditDocketEntryMetaForCourtIssued(testClient, 4);
  docketClerkStrikesDocketEntry(testClient, 4);
});

describe('Unauthed user views stricken docket entry for order', () => {
  unauthedUserSeesStrickenDocketEntry(cerebralTest, 4);
  unauthedUserAttemptsToViewStrickenDocumentUnsuccessfully(cerebralTest);
});

// Temporarily disabled for story 7387
describe.skip('Unauthed user searches for stricken order', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserSearchesForStrickenOrder(cerebralTest);
});
