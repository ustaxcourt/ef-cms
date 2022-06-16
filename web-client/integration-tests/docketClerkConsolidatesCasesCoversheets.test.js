import { docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase } from './journey/docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase';
import { docketClerkAddsDocketEntryForTrialExhibit } from './journey/docketClerkAddsDocketEntryForTrialExhibit';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();
const trialLocation = `Boise, Idaho, ${Date.now()}`;
cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];

const overrides = {
  preferredTrialCity: trialLocation,
  trialLocation,
};

const getRecordByEventCode = async (docketNumber, eventCode) => {
  await cerebralTest.runSequence('gotoCaseDetailSequence', {
    docketNumber,
  });
  let caseDetails = cerebralTest.getState('caseDetail');
  const record = caseDetails.docketEntries.find(
    docketEntry => docketEntry.eventCode === eventCode,
  );
  return record;
};

describe('Case Consolidation Coversheets Journey', () => {
  let case2DocketNumber, case3DocketNumber;

  beforeAll(() => {
    jest.setTimeout(30000);
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create the lead case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  it('login as a petitioner and create case 2 to consolidate with the lead case', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    const caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    case2DocketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  it('login as a petitioner and create case 3 to consolidate with the lead case', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    const caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    case3DocketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 3);

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('set up docket number', () => {
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber;
  });
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);
  docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase(
    cerebralTest,
    {
      draftOrderIndex: 0,
      getDocketNumbersToUncheck: () => [case3DocketNumber],
      getLeadCaseDocketNumber: () => cerebralTest.leadDocketNumber,
    },
  );

  it('verify the HE docket entries exist on both cases docket record', async () => {
    const leadCaseHERecord = await getRecordByEventCode(
      cerebralTest.leadDocketNumber,
      'HE',
    );
    expect(leadCaseHERecord).toBeDefined();

    const heRecordCase2 = await getRecordByEventCode(case2DocketNumber, 'HE');
    expect(heRecordCase2).not.toBeDefined();

    const heRecordCase3 = await getRecordByEventCode(case3DocketNumber, 'HE');
    expect(heRecordCase3).toBeDefined();

    expect(heRecordCase3.docketEntryId).toEqual(leadCaseHERecord.docketEntryId);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('set up docket number', () => {
    cerebralTest.docketNumber = case2DocketNumber;
    cerebralTest.draftOrders = [];
  });
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);
  docketClerkAddsDocketEntryForTrialExhibit(cerebralTest, {
    draftOrderIndex: 0,
    getDocketNumber: () => [case2DocketNumber],
  });

  it('verify the TE docket entry does not exist on other cases in the consolidated group', async () => {
    const case2TERecord = await getRecordByEventCode(
      cerebralTest.case2DocketNumber,
      'TE',
    );
    expect(case2TERecord).toBeDefined();

    const teRecordLeadCase = await getRecordByEventCode(
      cerebralTest.leadDocketNumber,
      'TE',
    );
    expect(teRecordLeadCase).not.toBeDefined();

    const teRecordCase3 = await getRecordByEventCode(case3DocketNumber, 'TE');
    expect(teRecordCase3).not.toBeDefined();
  });
});
