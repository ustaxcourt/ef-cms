import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { submittedAndCavCasesForJudgeHelper as submittedAndCavCasesForJudgeHelperComputed } from './submittedAndCavCasesForJudgeHelper';
import { withAppContextDecorator } from '../../../withAppContext';

describe('submittedAndCavCasesForJudgeHelper', () => {
  let baseState;
  let mockSubmittedAndCavCasesByJudge;

  const submittedAndCavCasesForJudgeHelper = withAppContextDecorator(
    submittedAndCavCasesForJudgeHelperComputed,
    { ...applicationContext },
  );

  beforeEach(() => {
    mockSubmittedAndCavCasesByJudge = [
      {
        caseStatusHistory: [
          { date: '2022-02-15T05:00:00.000Z' },
          { date: '2022-02-16T05:00:00.000Z' },
        ],
        docketNumber: '101-20',
        leadDocketNumber: '101-20',
      },
      {
        caseStatusHistory: [
          { date: '2022-02-15T05:00:00.000Z' },
          { date: '2022-02-26T05:00:00.000Z' },
        ],
        docketNumber: '110-15',
      },
      {
        caseStatusHistory: [
          { date: '2022-02-15T05:00:00.000Z' },
          { date: '2022-02-16T05:00:00.000Z' },
        ],
        docketNumber: '202-11',
      },
    ];

    baseState = {
      judgeActivityReportData: {
        submittedAndCavCasesByJudge: mockSubmittedAndCavCasesByJudge,
      },
    };
  });

  describe('filteredSubmittedAndCavCasesByJudge', () => {
    it('should return filteredSubmittedAndCavCasesByJudge off of state.submittedAndCavCasesByJudge with computed values', () => {
      (applicationContext.getUtilities().calculateDifferenceInDays as jest.Mock)
        .mockReturnValue(10)
        .mockReturnValueOnce(5);

      baseState.judgeActivityReportData.consolidatedCasesGroupCountMap =
        new Map([['101-20', 4]]);

      const { filteredSubmittedAndCavCasesByJudge } = runCompute(
        submittedAndCavCasesForJudgeHelper,
        {
          state: baseState,
        },
      );

      const leadCase = filteredSubmittedAndCavCasesByJudge.find(caseRecord => {
        return caseRecord.leadDocketNumber;
      })!;

      const unconsolidatedCases = filteredSubmittedAndCavCasesByJudge.filter(
        caseRecord => {
          return !caseRecord.leadDocketNumber;
        },
      );

      expect(filteredSubmittedAndCavCasesByJudge.length).toBe(3);
      expect(leadCase.consolidatedIconTooltipText).toBe('Lead case');
      expect(leadCase.isLeadCase).toBe(true);
      expect(leadCase.inConsolidatedGroup).toBe(true);
      expect(leadCase.formattedCaseCount).toBe(4);
      expect(leadCase.daysElapsedSinceLastStatusChange).toBe(5);

      expect(unconsolidatedCases.length).toBe(2);
      unconsolidatedCases.forEach(unconsolidatedCase => {
        expect(unconsolidatedCase.formattedCaseCount).toBe(1);
        expect(unconsolidatedCase.daysElapsedSinceLastStatusChange).toBe(10);
      });
    });

    it('should return filteredSubmittedAndCavCasesByJudge off of state.submittedAndCavCasesByJudge sorted by daysElapsedSinceLastStatusChange in descending order', () => {
      (applicationContext.getUtilities().calculateDifferenceInDays as jest.Mock)
        .mockReturnValue(10)
        .mockReturnValueOnce(5);
      baseState.judgeActivityReportData.consolidatedCasesGroupCountMap =
        new Map([['101-20', 4]]);

      const { filteredSubmittedAndCavCasesByJudge } = runCompute(
        submittedAndCavCasesForJudgeHelper,
        {
          state: baseState,
        },
      );

      expect(filteredSubmittedAndCavCasesByJudge.length).toBe(3);
      expect(
        filteredSubmittedAndCavCasesByJudge[0].daysElapsedSinceLastStatusChange,
      ).toBe(10);
      expect(
        filteredSubmittedAndCavCasesByJudge[1].daysElapsedSinceLastStatusChange,
      ).toBe(10);
      expect(
        filteredSubmittedAndCavCasesByJudge[2].daysElapsedSinceLastStatusChange,
      ).toBe(5);
    });

    it('should return filteredSubmittedAndCavCasesByJudge off of state.submittedAndCavCasesByJudge sorted by daysElapsedSinceLastStatusChange with cases without caseStatusHistory filtered out', () => {
      (applicationContext.getUtilities().calculateDifferenceInDays as jest.Mock)
        .mockReturnValue(10)
        .mockReturnValueOnce(5);

      baseState.judgeActivityReportData.consolidatedCasesGroupCountMap =
        new Map([['101-20', 4]]);
      baseState.judgeActivityReportData.submittedAndCavCasesByJudge.push({
        caseStatusHistory: [],
        docketNumber: '215-11',
      });

      const { filteredSubmittedAndCavCasesByJudge } = runCompute(
        submittedAndCavCasesForJudgeHelper,
        {
          state: baseState,
        },
      );

      expect(filteredSubmittedAndCavCasesByJudge.length).toBe(
        mockSubmittedAndCavCasesByJudge.length - 1,
      );
    });
  });
});
