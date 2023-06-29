import { docketClerkAddsAnUnservableDocument } from './journey/docketClerkAddsAnUnservableDocument';
import { docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater';
import { docketClerkAssignWorkItemToSelf } from './journey/docketClerkAssignWorkItemToSelf';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection } from './journey/docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection';
import { docketClerkVerifiesConsolidatedGroupInformationForDocumentQC } from './journey/docketClerkVerifiesConsolidatedGroupInformationForDocumentQC';
import { fakeFile, loginAs, setupTest } from './helpers';
import { practitionerFilesDocumentForOwnedCase } from './journey/practitionerFilesDocumentForOwnedCase';

describe('Docket clerk consolidated case work item journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const leadCaseDocketNumber = '111-19';
  const consolidatedCaseDocketNumber = '112-19';

  // Document QC External filed document on Lead Case

  it('sets the docketNumber', () => {
    cerebralTest.docketNumber = leadCaseDocketNumber;
  });

  loginAs(cerebralTest, 'privatepractitioner@example.com');

  practitionerFilesDocumentForOwnedCase(
    cerebralTest,
    fakeFile,
    leadCaseDocketNumber,
  );

  loginAs(cerebralTest, 'docketclerk@example.com');

  docketClerkVerifiesConsolidatedGroupInformationForDocumentQC(cerebralTest, {
    box: 'inbox',
    queue: 'section',
  });

  docketClerkAssignWorkItemToSelf(cerebralTest, leadCaseDocketNumber);

  docketClerkVerifiesConsolidatedGroupInformationForDocumentQC(cerebralTest, {
    box: 'inbox',
    queue: 'my',
  });

  docketClerkQCsDocketEntry(cerebralTest);

  docketClerkVerifiesConsolidatedGroupInformationForDocumentQC(cerebralTest, {
    box: 'outbox',
    queue: 'my',
  });

  docketClerkVerifiesConsolidatedGroupInformationForDocumentQC(cerebralTest, {
    box: 'outbox',
    queue: 'section',
  });

  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);

  docketClerkAddsAnUnservableDocument(cerebralTest);

  docketClerkVerifiesConsolidatedGroupInformationForDocumentQC(cerebralTest, {
    box: 'outbox',
    queue: 'section',
  });

  loginAs(cerebralTest, 'privatepractitioner@example.com');

  it('sets the docketNumber', () => {
    cerebralTest.docketNumber = consolidatedCaseDocketNumber;
  });

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

  docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection(
    cerebralTest,
    consolidatedCaseDocketNumber,
    { box: 'outbox', queue: 'my' },
  );

  docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection(
    cerebralTest,
    consolidatedCaseDocketNumber,
    { box: 'outbox', queue: 'section' },
  );

  // Document QC Internal filed document on Lead Case

  it('sets the docketNumber', () => {
    cerebralTest.docketNumber = leadCaseDocketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');

  docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater(
    cerebralTest,
    leadCaseDocketNumber,
  );

  docketClerkVerifiesConsolidatedGroupInformationForDocumentQC(cerebralTest, {
    box: 'inProgress',
    queue: 'section',
  });

  docketClerkVerifiesConsolidatedGroupInformationForDocumentQC(cerebralTest, {
    box: 'inProgress',
    queue: 'my',
  });

  // Document QC Internal filed document on Non-lead Case

  it('sets the docketNumber', () => {
    cerebralTest.docketNumber = consolidatedCaseDocketNumber;
  });

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
