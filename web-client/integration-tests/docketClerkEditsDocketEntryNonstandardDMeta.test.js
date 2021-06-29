import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkNavigatesToEditDocketEntryCertificateOfService } from './journey/docketClerkNavigatesToEditDocketEntryCertificateOfService';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerFilesANonstardardDDocumentForCase } from './journey/petitionerFilesANonstardardDDocumentForCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const test = setupTest();
test.draftOrders = [];

describe("Docket Clerk Edits a Docket Entry's Nonstandard D Metadata", () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();

    test.docketNumber = caseDetail.docketNumber;
    test.previousDocumentId = caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(test);

  loginAs(test, 'petitioner@example.com');
  petitionerFilesANonstardardDDocumentForCase(test, fakeFile);

  loginAs(test, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(test);
  docketClerkQCsDocketEntry(test);
  docketClerkChecksDocketEntryEditLink(test, { value: true });

  docketClerkNavigatesToEditDocketEntryCertificateOfService(test, 3);
});
