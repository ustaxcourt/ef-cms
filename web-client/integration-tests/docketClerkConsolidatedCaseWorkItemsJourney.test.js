import { docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater';
import { docketClerkAssignWorkItemToSelf } from './journey/docketClerkAssignWorkItemToSelf';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection } from './journey/docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection';
import { docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection } from './journey/docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection';
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

  const leadCaseDocketNumber = '111-19';
  const consolidatedCaseDocketNumber = '112-19';

  // Document QC External filed document on Lead Case

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  petitionsClerkAddsPractitionersToCase(
    cerebralTest,
    true,
    leadCaseDocketNumber,
  );

  loginAs(cerebralTest, 'privatePractitioner@example.com');

  practitionerFilesDocumentForOwnedCase(
    cerebralTest,
    fakeFile,
    leadCaseDocketNumber,
  );

  loginAs(cerebralTest, 'docketclerk@example.com');

  docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection(
    cerebralTest,
    leadCaseDocketNumber,
    { box: 'inbox', queue: 'section' },
  );

  docketClerkAssignWorkItemToSelf(cerebralTest, leadCaseDocketNumber);

  docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection(
    cerebralTest,
    leadCaseDocketNumber,
    { box: 'inbox', queue: 'my' },
  );

  docketClerkQCsDocketEntry(cerebralTest);

  docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection(
    cerebralTest,
    leadCaseDocketNumber,
    { box: 'outbox', queue: 'my' },
  );

  docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection(
    cerebralTest,
    leadCaseDocketNumber,
    { box: 'outbox', queue: 'section' },
  );

  // Document QC External filed document on Non-lead Case

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  petitionsClerkAddsPractitionersToCase(
    cerebralTest,
    true,
    consolidatedCaseDocketNumber,
  );

  loginAs(cerebralTest, 'privatePractitioner@example.com');

  practitionerFilesDocumentForOwnedCase(
    cerebralTest,
    fakeFile,
    consolidatedCaseDocketNumber,
  );

  loginAs(cerebralTest, 'docketclerk@example.com');

  docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection(
    cerebralTest,
    consolidatedCaseDocketNumber,
    { box: 'inbox', queue: 'section' },
  );
  docketClerkAssignWorkItemToSelf(cerebralTest, consolidatedCaseDocketNumber);

  docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection(
    cerebralTest,
    consolidatedCaseDocketNumber,
    { box: 'inbox', queue: 'my' },
  );

  docketClerkQCsDocketEntry(cerebralTest);

  docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection(
    cerebralTest,
    leadCaseDocketNumber,
    { box: 'outbox', queue: 'my' },
  );

  docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection(
    cerebralTest,
    leadCaseDocketNumber,
    { box: 'outbox', queue: 'section' },
  );

  // TODO: Document QC Internal filed document

  docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater(
    cerebralTest,
    fakeFile,
    leadCaseDocketNumber,
  );

  docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection(
    cerebralTest,
    leadCaseDocketNumber,
    { box: 'inProgress', queue: 'section' },
  );

  docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection(
    cerebralTest,
    leadCaseDocketNumber,
    { box: 'inProgress', queue: 'my' },
  );

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
