import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from './judgeActivityReportHelper';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('judgeActivityReportHelper', () => {
  let mockJudgeActivityReport;
  let mockForm;
  let baseState;

  const judgeActivityReportHelper = withAppContextDecorator(
    judgeActivityReportHelperComputed,
    { ...applicationContext },
  );

  beforeEach(() => {
    mockJudgeActivityReport = {
      casesClosedByJudge: {
        [CASE_STATUS_TYPES.closed]: 1,
        [CASE_STATUS_TYPES.closedDismissed]: 5,
      },
      opinions: [
        {
          count: 1,
          documentType: 'Memorandum Opinion',
          eventCode: 'MOP',
        },
        {
          count: 0,
          documentType: 'S Opinion',
          eventCode: 'SOP',
        },
        {
          count: 0,
          documentType: 'TC Opinion',
          eventCode: 'TCOP',
        },
        {
          count: 4,
          documentType: 'Bench Opinion',
          eventCode: 'OST',
        },
      ],
      orders: [
        {
          count: 1,
          documentType: 'Order',
          eventCode: 'O',
        },
        {
          count: 5,
          documentType: 'Order for Dismissal',
          eventCode: 'ODS',
        },
      ],
      trialSessions: {
        [SESSION_TYPES.regular]: 1,
        [SESSION_TYPES.hybrid]: 0.5,
        [SESSION_TYPES.motionHearing]: 1.5,
      },
    };

    mockForm = {
      judgeName: judgeUser.name,
    };

    baseState = {
      form: mockForm,
      judgeActivityReportData: mockJudgeActivityReport,
    };
  });

  describe('closedCasesTotal', () => {
    it('should be the sum of the values of cases closed off state.judgeActivityReportData', () => {
      const { closedCasesTotal } = runCompute(
        judgeActivityReportHelper as any,
        {
          state: baseState,
        },
      );

      expect(closedCasesTotal).toBe(6);
    });
  });

  describe('isFormPristine', () => {
    it('should be true when startDate is not populated', () => {
      const { isFormPristine } = runCompute(judgeActivityReportHelper as any, {
        state: {
          ...baseState,
          form: {
            ...mockForm,
            endDate: '01/02/2020',
            startDate: undefined,
          },
        },
      });

      expect(isFormPristine).toBe(true);
    });

    it('should be true when endDate is not populated', () => {
      const { isFormPristine } = runCompute(judgeActivityReportHelper as any, {
        state: {
          ...baseState,
          form: {
            ...mockForm,
            endDate: undefined,
            startDate: '01/02/2020',
          },
        },
      });

      expect(isFormPristine).toBe(true);
    });

    it('should be false when both startDate and endDate are populated', () => {
      const { isFormPristine } = runCompute(judgeActivityReportHelper as any, {
        state: {
          ...baseState,
          form: {
            ...mockForm,
            endDate: '01/02/2020',
            startDate: '01/02/2020',
          },
        },
      });

      expect(isFormPristine).toBe(false);
    });
  });

  describe('opinionsFiledTotal', () => {
    it('should be the sum of the values of opinions filed off state.judgeActivityReportData', () => {
      const { opinionsFiledTotal } = runCompute(
        judgeActivityReportHelper as any,
        {
          state: baseState,
        },
      );

      expect(opinionsFiledTotal).toBe(5);
    });
  });

  describe('ordersFiledTotal', () => {
    it('should be the sum of the values of orders filed off state.judgeActivityReportData', () => {
      const { ordersFiledTotal } = runCompute(
        judgeActivityReportHelper as any,
        {
          state: baseState,
        },
      );

      expect(ordersFiledTotal).toBe(6);
    });
  });

  describe('reportHeader', () => {
    it('should return reportHeader that includes judge name and the currentDate in MMDDYY format', () => {
      (
        applicationContext.getUtilities().prepareDateFromString as jest.Mock
      ).mockReturnValue('2020-01-01');

      const { reportHeader } = runCompute(judgeActivityReportHelper as any, {
        state: baseState,
      });

      expect(reportHeader).toBe(`${judgeUser.name} 01/01/20`);
    });
  });

  describe('showResultsTables', () => {
    it('should false when there are no orders, opinions, trial sessions and cases for the specified judge', () => {
      const { showResultsTables } = runCompute(
        judgeActivityReportHelper as any,
        {
          state: {
            form: mockForm,
            judgeActivityReportData: {},
          },
        },
      );

      expect(showResultsTables).toBe(false);
    });

    it('should true when there are orders, opinions, trial sessions or cases for the specified judge', () => {
      const { showResultsTables } = runCompute(
        judgeActivityReportHelper as any,
        {
          state: baseState,
        },
      );

      expect(showResultsTables).toBe(true);
    });
  });

  describe('showSelectDateRangeText', () => {
    it('should be false when the form has been submitted (there are orders, opinions, trial sessions and cases for the specified judge)', () => {
      const { showSelectDateRangeText } = runCompute(
        judgeActivityReportHelper as any,
        {
          state: baseState,
        },
      );

      expect(showSelectDateRangeText).toBe(false);
    });

    it('should true when form has NOT been submitted (there are orders, opinions, trial sessions or cases for the specified judge)', () => {
      const { showSelectDateRangeText } = runCompute(
        judgeActivityReportHelper as any,
        {
          state: {
            form: mockForm,
            judgeActivityReportData: {},
          },
        },
      );

      expect(showSelectDateRangeText).toBe(true);
    });
  });

  describe('trialSessionsHeldTotal', () => {
    it('should be the sum of the values of trialSessions off state.judgeActivityReportData', () => {
      const { trialSessionsHeldTotal } = runCompute(
        judgeActivityReportHelper as any,
        {
          state: baseState,
        },
      );

      expect(trialSessionsHeldTotal).toBe(3);
    });
  });

  describe('progressDescriptionTableTotal', () => {
    it('should be the sum of the number of cases off state.submittedAndCavCasesByJudge', () => {
      baseState.judgeActivityReportData.consolidatedCasesGroupCountMap =
        new Map();
      baseState.judgeActivityReportData.submittedAndCavCasesByJudge = [
        {
          caseStatusHistory: [
            { date: '2022-02-15T05:00:00.000Z' },
            { date: '2022-02-16T05:00:00.000Z' },
          ],
          docketNumber: '101-20',
        },
        {
          caseStatusHistory: [
            { date: '2022-02-15T05:00:00.000Z' },
            { date: '2022-02-16T05:00:00.000Z' },
          ],
          docketNumber: '103-20',
        },
        {
          caseStatusHistory: [
            { date: '2022-02-15T05:00:00.000Z' },
            { date: '2022-02-16T05:00:00.000Z' },
          ],
          docketNumber: '102-20',
        },
      ];
      const { progressDescriptionTableTotal } = runCompute(
        judgeActivityReportHelper as any,
        {
          state: baseState,
        },
      );

      expect(progressDescriptionTableTotal).toBe(3);
    });
  });

  describe('submittedAndCavCasesByJudge', () => {
    let mockSubmittedAndCavCasesByJudge;
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
    });

    it('should return filteredSubmittedAndCavCasesByJudge off of state.submittedAndCavCasesByJudge with computed values', () => {
      (applicationContext.getUtilities().calculateDifferenceInDays as jest.Mock)
        .mockReturnValue(10)
        .mockReturnValueOnce(5);

      baseState.judgeActivityReportData.consolidatedCasesGroupCountMap =
        new Map([['101-20', 4]]);
      baseState.judgeActivityReportData.submittedAndCavCasesByJudge =
        mockSubmittedAndCavCasesByJudge;

      const { filteredSubmittedAndCavCasesByJudge } = runCompute(
        judgeActivityReportHelper as any,
        {
          state: baseState,
        },
      );

      const leadCase = filteredSubmittedAndCavCasesByJudge.find(caseRecord => {
        return caseRecord.leadDocketNumber;
      });

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
      baseState.judgeActivityReportData.submittedAndCavCasesByJudge =
        mockSubmittedAndCavCasesByJudge;
      const { filteredSubmittedAndCavCasesByJudge } = runCompute(
        judgeActivityReportHelper as any,
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

      mockSubmittedAndCavCasesByJudge.push({
        caseStatusHistory: [],
        docketNumber: '215-11',
      });

      baseState.judgeActivityReportData.submittedAndCavCasesByJudge =
        mockSubmittedAndCavCasesByJudge;

      const { filteredSubmittedAndCavCasesByJudge } = runCompute(
        judgeActivityReportHelper as any,
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
