import { INITIAL_DOCUMENT_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkNavigatesToEditDocketEntryCertificateOfService } from './journey/docketClerkNavigatesToEditDocketEntryCertificateOfService';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerFilesANonstardardDDocumentForCase } from './journey/petitionerFilesANonstardardDDocumentForCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe("Docket Clerk Edits a Docket Entry's Nonstandard D Metadata", () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();

    cerebralTest.docketNumber = caseDetail.docketNumber;
    const petitionDocketEntry = caseDetail.docketEntries.find(
      entry => entry.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode,
    );
    cerebralTest.previousDocumentId = petitionDocketEntry.docketEntryId;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerFilesANonstardardDDocumentForCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(cerebralTest);
  docketClerkQCsDocketEntry(cerebralTest);
  docketClerkChecksDocketEntryEditLink(cerebralTest, { value: true });

  docketClerkNavigatesToEditDocketEntryCertificateOfService(cerebralTest, 4);
});
