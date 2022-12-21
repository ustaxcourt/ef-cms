import { docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase } from './journey/docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase';
import { docketClerkAddsDocketEntryForTrialExhibit } from './journey/docketClerkAddsDocketEntryForTrialExhibit';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('Case Consolidation Coversheets Journey', () => {
  let case2DocketNumber, case3DocketNumber;
  const trialLocation = `Boise, Idaho, ${Date.now()}`;

  const cerebralTest = setupTest();
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

  beforeAll(() => {
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create the lead case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest, overrides);
    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = cerebralTest.leadDocketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  it('login as a petitioner and create case 2 to consolidate with the lead case', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;

    const { docketNumber } = await uploadPetition(cerebralTest, overrides);
    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
    case2DocketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  it('login as a petitioner and create case 3 to consolidate with the lead case', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;

    const { docketNumber } = await uploadPetition(cerebralTest, overrides);
    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
    case3DocketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

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
