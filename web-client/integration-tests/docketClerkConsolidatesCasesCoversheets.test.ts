import { createConsolidatedGroup } from './journey/consolidation/createConsolidatedGroup';
import { docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase } from './journey/docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase';
import { docketClerkAddsDocketEntryForTrialExhibit } from './journey/docketClerkAddsDocketEntryForTrialExhibit';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { fakeFile, loginAs, setupTest } from './helpers';

describe('Case Consolidation Coversheets Journey', () => {
  const cerebralTest = setupTest();

  let firstMemberCaseDocketNumber, secondMemberCaseDocketNumber;

  const trialLocation = `Boise, Idaho, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };

  const getRecordByEventCode = async (docketNumber, eventCode) => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber,
    });

    const { docketEntries } = cerebralTest.getState('caseDetail');
    const record = docketEntries.find(
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

  describe('Create a consolidated group', () => {
    createConsolidatedGroup(cerebralTest, overrides, 2);
  });

  describe('Create a hearing exhibit, serve and multi-docket', () => {
    it('test setup', () => {
      firstMemberCaseDocketNumber =
        cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries[1];
      secondMemberCaseDocketNumber =
        cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries[2];
      cerebralTest.docketNumber = cerebralTest.leadDocketNumber;
    });

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);
    docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase(
      cerebralTest,
      {
        draftOrderIndex: 0,
        getDocketNumbersToUncheck: () => [secondMemberCaseDocketNumber],
        getLeadCaseDocketNumber: () => cerebralTest.leadDocketNumber,
      },
    );
    it('verify the HE docket entries exist on both cases docket record', async () => {
      const leadCaseHERecord = await getRecordByEventCode(
        cerebralTest.leadDocketNumber,
        'HE',
      );
      expect(leadCaseHERecord).toBeDefined();

      const heRecordCase2 = await getRecordByEventCode(
        firstMemberCaseDocketNumber,
        'HE',
      );
      expect(heRecordCase2).not.toBeDefined();

      const heRecordCase3 = await getRecordByEventCode(
        secondMemberCaseDocketNumber,
        'HE',
      );
      expect(heRecordCase3).toBeDefined();

      expect(heRecordCase3.docketEntryId).toEqual(
        leadCaseHERecord.docketEntryId,
      );
    });
  });

  describe('Create a trial exhibit, serve and multi-docket', () => {
    it('test setup', () => {
      cerebralTest.docketNumber = firstMemberCaseDocketNumber;
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

      const teRecordCase3 = await getRecordByEventCode(
        secondMemberCaseDocketNumber,
        'TE',
      );
      expect(teRecordCase3).not.toBeDefined();
    });
  });
});
