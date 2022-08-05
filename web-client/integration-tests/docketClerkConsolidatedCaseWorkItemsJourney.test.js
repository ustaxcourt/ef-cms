import { setupTest } from './helpers';
const cerebralTest = setupTest();

describe('Docket clerk consolidated case work item journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  // TODO: setup to test consolidated group cases for document QC
  // create a lead case
  // create a non-lead case
  // consolidate cases
  // need to add private practitioner to consolidated group lead case
  // need to add private practitioner to consolidated group non-lead case
  // login as private practitioner and go to dashboard
  // open consolidated lead case
  // file a document on lead case
  // file a document on non-lead case

  // TODO: Document QC for external filed document

  // login as docket clerk

  // TODO: Consolidated lead case
  // Navigate to Document QC Section
  // Navigate to Section Document QC Inbox
  // *VerifyLeadCaseIndicatorSectionDocumentQCInbox
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
