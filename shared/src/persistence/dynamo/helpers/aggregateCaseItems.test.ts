import {
  aggregateCaseItems,
  getAssociatedJudge,
  isArchivedCorrespondenceItem,
  isArchivedDocketEntryItem,
  isCaseItem,
  isCorrespondenceItem,
  isDocketEntryItem,
  isHearingItem,
  isIrsPractitionerItem,
  isPrivatePractitionerItem,
  isWorkItemItem,
} from './aggregateCaseItems';

describe('aggregateCaseItems', () => {
  const caseDocketNumber = '123-45';

  const caseRecord = {
    caseId: '123',
    docketNumber: caseDocketNumber,
    entityName: 'Case',
    judgeUserId: '789',
    pk: `case|${caseDocketNumber}`,
    sk: `case|${caseDocketNumber}`,
  };

  const docketEntryRecord = {
    archived: false,
    docketEntryId: '234',
    entityName: 'DocketEntry',
    pk: `case|${caseDocketNumber}`,
    sk: 'docket-entry|234',
  };

  const workItemRecord = {
    archived: false,
    docketEntry: {
      docketEntryId: docketEntryRecord.docketEntryId,
    },
    entityName: 'WorkItem',
    pk: `case|${caseDocketNumber}`,
    sk: 'work-item|098',
  };

  const archivedDocketEntryRecord = {
    archived: true,
    entityName: 'DocketEntry',
    pk: `case|${caseDocketNumber}`,
    sk: 'docket-entry|345',
  };

  const hearingRecord = {
    entityName: 'TrialSession',
    pk: `case|${caseDocketNumber}`,
    sk: 'hearing|234',
  };

  const judgeRecord = {
    name: 'Judge Dredd',
    pk: `case|${caseDocketNumber}`,
    sk: 'user|789',
  };

  const privatePractitionerRecord = {
    entityName: 'PrivatePractitioner',
    pk: `case|${caseDocketNumber}`,
    sk: 'privatePractitioner|234',
  };

  const irsPractitionerRecord = {
    entityName: 'IrsPractitioner',
    pk: `case|${caseDocketNumber}`,
    sk: 'irsPractitioner|234',
  };

  const correspondenceRecord = {
    archived: false,
    pk: 'case|123-45',
    sk: 'correspondence|234',
  };

  const archivedCorrespondenceRecord = {
    archived: true,
    pk: `case|${caseDocketNumber}`,
    sk: 'correspondence|234',
  };

  it('returns an object containing case data and its associated entities', () => {
    const caseAndCaseItems = [
      archivedCorrespondenceRecord,
      caseRecord,
      correspondenceRecord,
      docketEntryRecord,
      workItemRecord,
      archivedDocketEntryRecord,
      hearingRecord,
      irsPractitionerRecord,
      judgeRecord,
      privatePractitionerRecord,
    ];

    const aggregated = aggregateCaseItems(caseAndCaseItems);

    expect(aggregated).toMatchObject({
      ...caseRecord,
      archivedCorrespondences: [archivedCorrespondenceRecord],
      archivedDocketEntries: [archivedDocketEntryRecord],
      associatedJudge: judgeRecord.name,
      correspondence: [correspondenceRecord],
      docketEntries: [{ ...docketEntryRecord, workItem: workItemRecord }],
      hearings: [hearingRecord],
      irsPractitioners: [irsPractitionerRecord],
      privatePractitioners: [privatePractitionerRecord],
    });
  });

  describe('getAssociatedJudge', () => {
    it('returns the associated judge by id if judgeUserId is set on the case', () => {
      const mockCaseRecord = {
        ...caseRecord,
        judgeUserId: '789',
      };

      const mockJudgeRecord = {
        name: 'Judge Dredd',
        pk: `case|${caseDocketNumber}`,
        sk: 'user|789',
      };

      const judgeResult = getAssociatedJudge(mockCaseRecord, [
        mockCaseRecord,
        mockJudgeRecord,
      ]);

      expect(judgeResult).toEqual('Judge Dredd');
    });

    it('returns the associated judge by name if judgeUserId is not set on the case', () => {
      const differentCaseRecord = {
        ...caseRecord,
        associatedJudge: 'Judge Reinhold',
        judgeUserId: undefined,
      };

      const judgeResult = getAssociatedJudge(differentCaseRecord, [
        differentCaseRecord,
        judgeRecord,
      ]);

      expect(judgeResult).toEqual('Judge Reinhold');
    });

    it('returns undefined if the judgeUserId is not found in associated case records', () => {
      const differentJudgeRecord = {
        ...judgeRecord,
        sk: 'user|123', // NOT 789
      };

      const judgeResult = getAssociatedJudge(caseRecord, [
        caseRecord,
        differentJudgeRecord,
      ]);

      expect(judgeResult).toEqual(undefined);
    });
  });

  describe('isArchivedCorrespondenceItem', () => {
    it('returns true if the item is an archived correspondence item', () => {
      expect(
        isArchivedCorrespondenceItem(archivedCorrespondenceRecord),
      ).toEqual(true);
    });

    it('returns false if the item is a correspondence item', () => {
      expect(isArchivedCorrespondenceItem(correspondenceRecord)).toEqual(false);
    });

    it('returns false if the item is NOT a correspondence item', () => {
      expect(isArchivedCorrespondenceItem(caseRecord)).toEqual(false);
      expect(isArchivedCorrespondenceItem(correspondenceRecord)).toEqual(false);
      expect(isArchivedCorrespondenceItem(docketEntryRecord)).toEqual(false);
      expect(isArchivedCorrespondenceItem(hearingRecord)).toEqual(false);
      expect(isArchivedCorrespondenceItem(judgeRecord)).toEqual(false);
      expect(isArchivedCorrespondenceItem(privatePractitionerRecord)).toEqual(
        false,
      );
      expect(isArchivedCorrespondenceItem(irsPractitionerRecord)).toEqual(
        false,
      );
      expect(isArchivedCorrespondenceItem(workItemRecord)).toEqual(false);
    });
  });

  describe('isArchivedDocketEntryItem', () => {
    it('returns true if the item is an archived docket entry item', () => {
      expect(isArchivedDocketEntryItem(archivedDocketEntryRecord)).toEqual(
        true,
      );
    });

    it('returns false if the item is a docket entry item', () => {
      expect(isArchivedDocketEntryItem(docketEntryRecord)).toEqual(false);
    });

    it('returns false if the item is NOT an archived docket entry item', () => {
      expect(isArchivedDocketEntryItem(caseRecord)).toEqual(false);
      expect(isArchivedDocketEntryItem(hearingRecord)).toEqual(false);
      expect(isArchivedDocketEntryItem(judgeRecord)).toEqual(false);
      expect(isArchivedDocketEntryItem(privatePractitionerRecord)).toEqual(
        false,
      );
      expect(isArchivedDocketEntryItem(irsPractitionerRecord)).toEqual(false);
      expect(isArchivedDocketEntryItem(correspondenceRecord)).toEqual(false);
      expect(isArchivedDocketEntryItem(archivedCorrespondenceRecord)).toEqual(
        false,
      );
      expect(isArchivedDocketEntryItem(workItemRecord)).toEqual(false);
    });
  });

  describe('isCaseItem', () => {
    it('returns true if the item is a case item', () => {
      expect(isCaseItem(caseRecord)).toEqual(true);
    });

    it('returns false if the item is NOT a case item', () => {
      expect(isCaseItem(correspondenceRecord)).toEqual(false);
      expect(isCaseItem(docketEntryRecord)).toEqual(false);
      expect(isCaseItem(hearingRecord)).toEqual(false);
      expect(isCaseItem(judgeRecord)).toEqual(false);
      expect(isCaseItem(privatePractitionerRecord)).toEqual(false);
      expect(isCaseItem(irsPractitionerRecord)).toEqual(false);
      expect(isCaseItem(archivedCorrespondenceRecord)).toEqual(false);
      expect(isCaseItem(workItemRecord)).toEqual(false);
    });
  });

  describe('isCorrespondenceItem', () => {
    it('returns true if the item is a correspondence item', () => {
      expect(isCorrespondenceItem(correspondenceRecord)).toEqual(true);
    });

    it('returns false if the item is an archived correspondence item', () => {
      expect(isCorrespondenceItem(archivedCorrespondenceRecord)).toEqual(false);
    });

    it('returns false if the item is NOT a correspondence item', () => {
      expect(isCorrespondenceItem(caseRecord)).toEqual(false);
      expect(isCorrespondenceItem(docketEntryRecord)).toEqual(false);
      expect(isCorrespondenceItem(hearingRecord)).toEqual(false);
      expect(isCorrespondenceItem(judgeRecord)).toEqual(false);
      expect(isCorrespondenceItem(privatePractitionerRecord)).toEqual(false);
      expect(isCorrespondenceItem(irsPractitionerRecord)).toEqual(false);
      expect(isCorrespondenceItem(archivedCorrespondenceRecord)).toEqual(false);
      expect(isCorrespondenceItem(workItemRecord)).toEqual(false);
    });
  });

  describe('isDocketEntryItem', () => {
    it('returns true if the item is a docket entry item', () => {
      expect(isDocketEntryItem(docketEntryRecord)).toEqual(true);
    });

    it('returns false if the item is an archived docket entry item', () => {
      expect(isDocketEntryItem(archivedDocketEntryRecord)).toEqual(false);
    });

    it('returns false if the item is NOT a docket entry item', () => {
      expect(isDocketEntryItem(caseRecord)).toEqual(false);
      expect(isDocketEntryItem(hearingRecord)).toEqual(false);
      expect(isDocketEntryItem(judgeRecord)).toEqual(false);
      expect(isDocketEntryItem(privatePractitionerRecord)).toEqual(false);
      expect(isDocketEntryItem(irsPractitionerRecord)).toEqual(false);
      expect(isDocketEntryItem(correspondenceRecord)).toEqual(false);
      expect(isDocketEntryItem(archivedCorrespondenceRecord)).toEqual(false);
      expect(isDocketEntryItem(workItemRecord)).toEqual(false);
    });
  });

  describe('isWorkItemItem', () => {
    it('returns true if the item is a workitem item', () => {
      expect(isWorkItemItem(workItemRecord)).toEqual(true);
    });

    it('returns false if the item is NOT a workitem item', () => {
      expect(isWorkItemItem(docketEntryRecord)).toEqual(false);
      expect(isWorkItemItem(caseRecord)).toEqual(false);
      expect(isWorkItemItem(hearingRecord)).toEqual(false);
      expect(isWorkItemItem(judgeRecord)).toEqual(false);
      expect(isWorkItemItem(privatePractitionerRecord)).toEqual(false);
      expect(isWorkItemItem(irsPractitionerRecord)).toEqual(false);
      expect(isWorkItemItem(correspondenceRecord)).toEqual(false);
      expect(isWorkItemItem(archivedCorrespondenceRecord)).toEqual(false);
    });
  });

  describe('isHearingItem', () => {
    it('returns true if the item is a hearing item', () => {
      expect(isHearingItem(hearingRecord)).toEqual(true);
    });

    it('returns false if the item is NOT a hearing item', () => {
      expect(isHearingItem(caseRecord)).toEqual(false);
      expect(isHearingItem(docketEntryRecord)).toEqual(false);
      expect(isHearingItem(judgeRecord)).toEqual(false);
      expect(isHearingItem(privatePractitionerRecord)).toEqual(false);
      expect(isHearingItem(irsPractitionerRecord)).toEqual(false);
      expect(isHearingItem(correspondenceRecord)).toEqual(false);
      expect(isHearingItem(archivedCorrespondenceRecord)).toEqual(false);
      expect(isHearingItem(workItemRecord)).toEqual(false);
    });
  });

  describe('isIrsPractitionerItem', () => {
    it('returns true if the item is an irs practitioner item', () => {
      expect(isIrsPractitionerItem(irsPractitionerRecord)).toEqual(true);
    });

    it('returns false if the item is NOT an irs practitioner item', () => {
      expect(isIrsPractitionerItem(caseRecord)).toEqual(false);
      expect(isIrsPractitionerItem(correspondenceRecord)).toEqual(false);
      expect(isIrsPractitionerItem(docketEntryRecord)).toEqual(false);
      expect(isIrsPractitionerItem(hearingRecord)).toEqual(false);
      expect(isIrsPractitionerItem(judgeRecord)).toEqual(false);
      expect(isIrsPractitionerItem(privatePractitionerRecord)).toEqual(false);
      expect(isIrsPractitionerItem(archivedCorrespondenceRecord)).toEqual(
        false,
      );
      expect(isIrsPractitionerItem(workItemRecord)).toEqual(false);
    });
  });

  describe('isPrivatePractitionerItem', () => {
    it('returns true if the item is a private practitioner item', () => {
      expect(isPrivatePractitionerItem(privatePractitionerRecord)).toEqual(
        true,
      );
    });

    it('returns false if the item is NOT a private practitioner item', () => {
      expect(isPrivatePractitionerItem(caseRecord)).toEqual(false);
      expect(isPrivatePractitionerItem(correspondenceRecord)).toEqual(false);
      expect(isPrivatePractitionerItem(docketEntryRecord)).toEqual(false);
      expect(isPrivatePractitionerItem(hearingRecord)).toEqual(false);
      expect(isPrivatePractitionerItem(judgeRecord)).toEqual(false);
      expect(isPrivatePractitionerItem(irsPractitionerRecord)).toEqual(false);
      expect(isPrivatePractitionerItem(archivedCorrespondenceRecord)).toEqual(
        false,
      );
      expect(isPrivatePractitionerItem(workItemRecord)).toEqual(false);
    });
  });
});
