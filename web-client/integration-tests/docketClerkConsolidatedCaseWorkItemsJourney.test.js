import { docketClerkVerifiesConsolidatedCaseLeadIndicatorDocumentQCInbox } from './journey/docketClerkVerifiesConsolidatedCaseLeadIndicatorDocumentQCSectionInbox';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { practitionerFilesDocumentForOwnedCase } from './journey/practitionerFilesDocumentForOwnedCase';

const cerebralTest = setupTest();

describe('Docket clerk consolidated case work item journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  // TODO: setup to test consolidated group cases for document QC

  const leadCaseDocketNumber = '111-19';
  const consolidatedCaseDocketNumber = '112-19';

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(
    cerebralTest,
    true,
    leadCaseDocketNumber,
  );

  petitionsClerkAddsPractitionersToCase(
    cerebralTest,
    true,
    consolidatedCaseDocketNumber,
  );

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  practitionerFilesDocumentForOwnedCase(
    cerebralTest,
    fakeFile,
    leadCaseDocketNumber,
  );
  practitionerFilesDocumentForOwnedCase(
    cerebralTest,
    fakeFile,
    consolidatedCaseDocketNumber,
  );

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkVerifiesConsolidatedCaseLeadIndicatorDocumentQCInbox(
    cerebralTest,
    leadCaseDocketNumber,
  );

  // TODO: Consolidated lead case
  // Assign work item to docket clerk
  // *VerifyLeadCaseIndicatorUserDocumentQCInbox
  // Complete Document QC
  // Verify alertSuccess says "<Document Type> Record has been completed."
  // *VerifyLeadCaseIndicatorUserDocumentQCOutbox
  // *VerifyLeadCaseIndicatorSectionDocumentQCOutbox

  // TODO: Consolidated non-lead case
  // Navigate to Document QC Section
  // Navigate to Section Document QC Inbox
  // *VerifyNonLeadCaseIndicatorSectionDocumentQCInbox
  // Assign work item to docket clerk
  // *VerifyNonLeadCaseIndicatorUserDocumentQCInbox
  // Complete Document QC
  // Verify alertSuccess says "<Document Type> Record has been completed."
  // *VerifyNonLeadCaseIndicatorUserDocumentQCOutbox
  // *VerifyNonLeadCaseIndicatorSectionDocumentQCOutbox

  // TODO: Document QC Internal filed document

  // TODO: Consolidated lead case
  // Search for consolidated case lead docket number
  // Create a paper filing on lead docket number
  // Save filing for later
  // Verify alertSuccess says "Your entry has been added to the docket record."
  // Navigate to Document QC Section
  // Navigate to Section Document QC In Progress
  // *VerifyLeadCaseIndicatorSectionDocumentQCInProgress
  // *VerifyLeadCaseIndicatorUserDocumentQCInProgress
  // Save and Serve Document
  // Verify alertSuccess says "Your entry has been added to the docket record."
  // !BUG: no indicators are present
  // *VerifyLeadCaseIndicatorUserDocumentQCOutbox
  // *VerifyLeadCaseIndicatorSectionDocumentQCOutbox

  // TODO: Consolidated non-lead case
  // Search for consolidated case non-lead docket number
  // Create a paper filing on non-lead docket number
  // Save filing for later
  // Verify alertSuccess says "Your entry has been added to the docket record."
  // Navigate to Document QC Section
  // Navigate to Section Document QC In Progress
  // *VerifyNonLeadCaseIndicatorSectionDocumentQCInProgress
  // *VerifyNonLeadCaseIndicatorUserDocumentQCInProgress
  // Save and Serve Document
  // Verify alertSuccess says "Your entry has been added to the docket record."
  // !BUG: no indicators are present
  // *VerifyNonLeadCaseIndicatorUserDocumentQCOutbox
  // *VerifyNonLeadCaseIndicatorSectionDocumentQCOutbox
});
