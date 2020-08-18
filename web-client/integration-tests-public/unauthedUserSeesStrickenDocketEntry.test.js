import { docketClerkChecksDocketEntryEditLink } from '../integration-tests/journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkNavigatesToEditDocketEntryMeta } from '../integration-tests/journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkQCsDocketEntry } from '../integration-tests/journey/docketClerkQCsDocketEntry';
import { docketClerkStrikesDocketEntry } from '../integration-tests/journey/docketClerkStrikesDocketEntry';
import {
  fakeFile,
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionerFilesADocumentForCase } from '../integration-tests/journey/petitionerFilesADocumentForCase';
import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesByDocketNumber } from './journey/unauthedUserSearchesByDocketNumber';
import { unauthedUserSeesStrickenDocketEntry } from './journey/unauthedUserSeesStrickenDocketEntry';

const test = setupTest();
const testClient = setupTestClient();
testClient.draftOrders = [];

describe('Petitioner creates a case and adds a document', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(testClient, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(testClient);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
  });
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

describe('Unauthed user sees stricken docket entry', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesByDocketNumber(test, testClient);
  unauthedUserSeesStrickenDocketEntry(test, 3);
});
