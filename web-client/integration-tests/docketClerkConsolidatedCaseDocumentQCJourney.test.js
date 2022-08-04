import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import {
  docketClerkViewsSectionInbox,
  docketClerkViewsSectionInboxNotHighPriority,
} from './journey/docketClerkViewsSectionInboxNotHighPriority';
import { fakeFile } from '../integration-tests-public/helpers';
import {
  getFormattedDocumentQCMyInbox,
  getFormattedDocumentQCSectionInbox,
  getIndividualInboxCount,
  getNotifications,
  getSectionInboxCount,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadExternalAdministrativeRecord,
  uploadExternalDecisionDocument,
  uploadPetition,
} from './helpers';
import { petitionsClerkViewsMyDocumentQC } from './journey/petitionsClerkViewsMyDocumentQC';
import { petitionsClerkViewsSectionDocumentQC } from './journey/petitionsClerkViewsSectionDocumentQC';
import { practitionerCreatesNewCase } from './journey/practitionerCreatesNewCase';
import { practitionerFilesDocumentForOwnedCase } from './journey/practitionerFilesDocumentForOwnedCase';

const cerebralTest = setupTest();

describe('Docket clerk consolidated case work item journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };
  const trialLocation = `Boise, Idaho, ${Date.now()}`;
  let caseDetail;
  let qcMyInboxCountBefore;
  let qcSectionInboxCountBefore;
  let notificationsBefore;
  let decisionWorkItem;

  // TODO: setup to test consolidated group cases for document QC
  // loginAs(cerebralTest, 'docketclerk@example.com');

  // it('login as the docketclerk and cache the initial inbox counts', async () => {
  //   await getFormattedDocumentQCMyInbox(cerebralTest);
  //   qcMyInboxCountBefore = getIndividualInboxCount(cerebralTest);

  //   await getFormattedDocumentQCSectionInbox(cerebralTest);
  //   qcSectionInboxCountBefore = getSectionInboxCount(cerebralTest);

  //   notificationsBefore = getNotifications(cerebralTest);
  // });

  // create a lead case
  loginAs(cerebralTest, 'petitioner@example.com');

  it('login as a petitioner and create the lead case', async () => {
    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
  });

  // upload to file to lead case

  it('petitioner uploads the external documents', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    await uploadExternalDecisionDocument(cerebralTest);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('login as the docketclerk and verify there are 4 document qc section inbox entries', async () => {
    await refreshElasticsearchIndex();

  // it('login as the docketclerk and verify there are 4 document qc section inbox entries', async () => {
  //   await refreshElasticsearchIndex();

  //   const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
  //     cerebralTest,
  //   );

  //   decisionWorkItem = documentQCSectionInbox.find(
  //     workItem => workItem.docketNumber === caseDetail.docketNumber,
  //   );
  //   expect(decisionWorkItem).toMatchObject({
  //     docketEntry: {
  //       documentTitle: 'Agreed Computation for Entry of Decision',
  //       userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
  //     },
  //   });

  //   const qcSectionInboxCountAfter = getSectionInboxCount(cerebralTest);
  //   expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 4);
  // });

  // create a non-lead case

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case to consolidate with', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  // upload file to non-lead case
  it('should file a document on non-lead case', async () => {
    // file a document on lead case
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: caseDetail.docketNumber,
    });
  });

  // upload file to non-lead case
  it('should file a document on non-lead case', async () => {
    // file a document on lead case
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: caseDetail.docketNumber,
    });
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  // consolidate cases
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  // login as docket clerk
  // loginAs(cerebralTest, 'docketclerk@example.com');
  // docketClerkViewsSectionInbox(cerebralTest);

  // 103 - 22;
  // 104 - 22;

  // filter for the consolidated cases (lead, non-lead)

  // TODO: Consolidated lead case
  // 1. Navigate to Document QC Section
  //    Navigate to Section Document QC Inbox
  // 2 *VerifyLeadCaseIndicatorSectionDocumentQCInbox
  // 3. Assign work item to docket clerk
  //    Navigate to personal
  // 4. *VerifyLeadCaseIndicatorUserDocumentQCInbox in personal inbox
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
