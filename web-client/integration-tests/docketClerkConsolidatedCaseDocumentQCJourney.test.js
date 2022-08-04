import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
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
  // create a lead case

  it('login as a petitioner and create the lead case', async () => {
    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
  });

  // loginAs(cerebralTest, 'privatePractitioner@example.com');
  //TODO: refactor practitionerCreatesNewCase to use an object as a 2nd arg
  // practitionerCreatesNewCase(
  //   cerebralTest,
  //   fakeFile,
  //   undefined,
  //   undefined,
  //   true,
  // );
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  it('login as the docketclerk and cache the initial inbox counts', async () => {
    await getFormattedDocumentQCMyInbox(cerebralTest);
    qcMyInboxCountBefore = getIndividualInboxCount(cerebralTest);

    await getFormattedDocumentQCSectionInbox(cerebralTest);
    qcSectionInboxCountBefore = getSectionInboxCount(cerebralTest);

    notificationsBefore = getNotifications(cerebralTest);
  });

  // upload file to lead case
  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner uploads the external document to lead case', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: caseDetail.leadDocketNumber,
    });

    await uploadExternalAdministrativeRecord(cerebralTest);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('login as the docketclerk and verify there are 4 document qc section inbox entries', async () => {
    await refreshElasticsearchIndex();

    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      cerebralTest,
    );
    console.log('inbox:', documentQCSectionInbox.slice(-1));

    // decisionWorkItem = documentQCSectionInbox.find(
    //   workItem => workItem.docketNumber === caseDetail.docketNumber,
    // );
    // expect(decisionWorkItem).toMatchObject({
    //   docketEntry: {
    //     documentTitle: 'Agreed Computation for Entry of Decision',
    //     userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    //   },
    // });

    // const qcSectionInboxCountAfter = getSectionInboxCount(cerebralTest);
    // expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 4);
  });

  // consolidate cases
  // docketClerkOpensCaseConsolidateModal(cerebralTest);
  // docketClerkSearchesForCaseToConsolidateWith(cerebralTest);

  // file a document on lead case
  // loginAs(cerebralTest, 'privatePractitioner@example.com');
  // practitionerFilesDocumentForOwnedCase(cerebralTest, fakeFile);

  // create a non-lead case
  // loginAs(cerebralTest, 'privatePractitioner@example.com');
  // practitionerCreatesNewCase(cerebralTest, fakeFile);

  it('login as a petitioner and create a case to consolidate with', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  // consolidate cases
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  // file a document on non-lead case
  loginAs(cerebralTest, 'privatePractitioner@example.com');
  practitionerFilesDocumentForOwnedCase(cerebralTest, fakeFile);

  // login as petitions clerk
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsSectionDocumentQC(cerebralTest);

  // filter for the consolidated cases (lead, non-lead)

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
