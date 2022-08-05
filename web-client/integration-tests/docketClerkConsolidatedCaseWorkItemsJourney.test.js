import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import {
  getFormattedDocumentQCMyInbox,
  getFormattedDocumentQCSectionInbox,
  getIndividualInboxCount,
  getSectionInboxCount,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadExternalAdministrativeRecord,
  uploadExternalRatificationDocument,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const cerebralTest = setupTest();

const trialLocation = `Boise, Idaho, ${Date.now()}`;
cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];

const overrides = {
  preferredTrialCity: trialLocation,
  trialLocation,
};

let caseDetail;
let qcMyInboxCountBefore;
let qcSectionInboxCountBefore;
let decisionWorkItem;

describe('Docket clerk consolidated case work items journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('login as the docketclerk and cache the initial inbox counts', async () => {
    await getFormattedDocumentQCMyInbox(cerebralTest);
    qcMyInboxCountBefore = getIndividualInboxCount(cerebralTest);

    await getFormattedDocumentQCSectionInbox(cerebralTest);
    qcSectionInboxCountBefore = getSectionInboxCount(cerebralTest);
  });

  // create a lead case

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create the lead case', async () => {
    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner uploads the external documents', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    await uploadExternalRatificationDocument(cerebralTest);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('login as the docketclerk and verify there are 1 document qc section inbox entries', async () => {
    await refreshElasticsearchIndex();

    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      cerebralTest,
    );

    decisionWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );

    expect(decisionWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Ratification of do the test',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    const qcSectionInboxCountAfter = getSectionInboxCount(cerebralTest);
    expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 1);
  });

  // create a case to consolidate with
  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case to consolidate with', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  // consolidate cases
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner uploads the external documents', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    await uploadExternalRatificationDocument(cerebralTest);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('login as the docketclerk and verify there are 1 document qc section inbox entries', async () => {
    await refreshElasticsearchIndex();

    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      cerebralTest,
    );

    decisionWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );

    expect(decisionWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Ratification of do the test',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    const qcSectionInboxCountAfter = getSectionInboxCount(cerebralTest);
    expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 2);
  });

  it('return casedetail', () => {
    caseDetail = cerebralTest.getState('caseDetail');
    console.log(caseDetail);
    // const { consolidatedCases } = caseDetail;
    // console.log('consolidatedCases', consolidatedCases);
    // const { leadDocketNumber } = caseDetail;
    // console.log('leadDocketNumber', leadDocketNumber);
  });
});
