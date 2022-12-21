import { docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater';
import { docketClerkAssignWorkItemToSelf } from './journey/docketClerkAssignWorkItemToSelf';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection } from './journey/docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection';
import { docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection } from './journey/docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { practitionerFilesDocumentForOwnedCase } from './journey/practitionerFilesDocumentForOwnedCase';

describe('Docket clerk consolidated case work item journey', () => {
  const cerebralTest = setupTest();

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

  loginAs(cerebralTest, 'privatepractitioner@example.com');

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

  loginAs(cerebralTest, 'privatepractitioner@example.com');

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

  // Document QC Internal filed document on Lead Case

  loginAs(cerebralTest, 'docketclerk@example.com');

  docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater(
    cerebralTest,
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

  // Document QC Internal filed document on Non-lead Case

  loginAs(cerebralTest, 'docketclerk@example.com');

  docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater(
    cerebralTest,
    consolidatedCaseDocketNumber,
  );

  docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection(
    cerebralTest,
    consolidatedCaseDocketNumber,
    { box: 'inProgress', queue: 'section' },
  );

  docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection(
    cerebralTest,
    consolidatedCaseDocketNumber,
    { box: 'inProgress', queue: 'my' },
  );
});
