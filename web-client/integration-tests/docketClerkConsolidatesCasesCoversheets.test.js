import { docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase } from './journey/docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase';
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
    const getHeRecord = async docketNumber => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });
      let caseDetails = cerebralTest.getState('caseDetail');
      const heRecord = caseDetails.docketEntries.find(
        docketEntry => docketEntry.eventCode === 'HE',
      );
      return heRecord;
    };

    const leadCaseHERecord = await getHeRecord(cerebralTest.leadDocketNumber);
    expect(leadCaseHERecord).toBeDefined();

    const heRecordCase2 = await getHeRecord(case2DocketNumber);
    expect(heRecordCase2).not.toBeDefined();

    const heRecordCase3 = await getHeRecord(case3DocketNumber);
    expect(heRecordCase3).toBeDefined();

    expect(heRecordCase3.docketEntryId).toEqual(leadCaseHERecord.docketEntryId);
  });
});
