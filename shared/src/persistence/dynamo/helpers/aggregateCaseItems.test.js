const {
  aggregateCaseItems,
  getAssociatedJudge,
} = require('./aggregateCaseItems');

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
    entityName: 'DocketEntry',
    pk: `case|${caseDocketNumber}`,
    sk: 'docket-entry|234',
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
      docketEntries: [docketEntryRecord],
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
});
