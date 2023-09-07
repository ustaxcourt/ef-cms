import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from './judgeActivityReportHelper';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('judgeActivityReportHelper', () => {
  let mockJudgeActivityReport;
  let judgeActivityReportFilters;
  let baseState;

  const mockTotalCountForSubmittedAndCavCases = 15;
  let mockSubmittedAndCavCasesByJudge;

  const judgeActivityReportHelper = withAppContextDecorator(
    judgeActivityReportHelperComputed,
    { ...applicationContext },
  );

  beforeEach(() => {
    mockSubmittedAndCavCasesByJudge = [
      {
        daysElapsedSinceLastStatusChange: 1,
        docketNumber: '101-20',
        formattedCaseCount: 4,
      },
      {
        daysElapsedSinceLastStatusChange: 1,
        docketNumber: '103-20',
      },
      {
        daysElapsedSinceLastStatusChange: 1,
        docketNumber: '102-20',
      },
    ];

    mockJudgeActivityReport = {
      casesClosedByJudge: {
        aggregations: {
          [CASE_STATUS_TYPES.closed]: 1,
          [CASE_STATUS_TYPES.closedDismissed]: 5,
        },
        total: 6,
      },
      opinions: {
        aggregations: [
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
        total: 5,
      },
      orders: {
        aggregations: [
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
        total: 6,
      },
      trialSessions: {
        aggregations: {
          [SESSION_TYPES.regular]: 1,
          [SESSION_TYPES.hybrid]: 0.5,
          [SESSION_TYPES.motionHearing]: 1.5,
        },
        total: 3,
      },
    };

    judgeActivityReportFilters = {
      judgeNameToDisplayForHeader: judgeUser.name,
    };

    baseState = {
      judgeActivityReport: {
        filters: judgeActivityReportFilters,
        judgeActivityReportData: mockJudgeActivityReport,
      },
      validationErrors: {
        endDate: undefined,
      },
    };
  });

  describe('closedCasesTotal', () => {
    it('should be the sum of the values of cases closed off state.judgeActivityReportData', () => {
      const { closedCasesTotal } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(closedCasesTotal).toBe(6);
    });
    it('should be 0 if state.judgeActivityReportData.casesClosedByJudge has not been set', () => {
      baseState.judgeActivityReport.judgeActivityReportData.casesClosedByJudge.total = 0;
      const { closedCasesTotal } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(closedCasesTotal).toBe(0);
    });
  });

  describe('isFormPristine', () => {
    it('should be true when startDate is not populated', () => {
      const { isFormPristine } = runCompute(judgeActivityReportHelper, {
        state: {
          ...baseState,
          judgeActivityReport: {
            ...baseState.judgeActivityReport,
            filters: {
              ...judgeActivityReportFilters,
              endDate: '01/02/2020',
              startDate: '',
            },
          },
        },
      });

      expect(isFormPristine).toBe(true);
    });

    it('should be true when endDate is not populated', () => {
      const { isFormPristine } = runCompute(judgeActivityReportHelper, {
        state: {
          ...baseState,
          judgeActivityReport: {
            ...baseState.judgeActivityReport,
            filters: {
              ...judgeActivityReportFilters,
              endDate: '',
              startDate: '01/02/2020',
            },
          },
        },
      });

      expect(isFormPristine).toBe(true);
    });

    it('should be false when both startDate and endDate are populated', () => {
      const { isFormPristine } = runCompute(judgeActivityReportHelper, {
        state: {
          ...baseState,
          judgeActivityReport: {
            ...baseState.judgeActivityReport,
            filters: {
              ...judgeActivityReportFilters,
              endDate: '01/02/2020',
              startDate: '01/02/2020',
            },
          },
        },
      });

      expect(isFormPristine).toBe(false);
    });
  });

  describe('opinionsFiledTotal', () => {
    it('should be the sum of the values of opinions filed off state.judgeActivityReportData', () => {
      const { opinionsFiledTotal } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(opinionsFiledTotal).toBe(5);
    });

    it('should be 0 if state.judgeActivityReportData.opinions has not been set', () => {
      baseState.judgeActivityReport.judgeActivityReportData.opinions.total = 0;

      const { opinionsFiledTotal } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(opinionsFiledTotal).toBe(0);
    });
  });

  describe('ordersFiledTotal', () => {
    it('should be the sum of the values of orders filed off state.judgeActivityReportData', () => {
      const { ordersFiledTotal } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(ordersFiledTotal).toBe(6);
    });
    it('should be 0 if state.judgeActivityReportData.orders has not been set', () => {
      baseState.judgeActivityReport.judgeActivityReportData.orders.total = 0;

      const { ordersFiledTotal } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(ordersFiledTotal).toBe(0);
    });
  });

  describe('orders displayed', () => {
    it('should only return a list of orders with a total count', () => {
      baseState.judgeActivityReport.judgeActivityReportData.orders.aggregations =
        [
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
          {
            count: 0,
            documentType: 'Order for Dismissal',
            eventCode: 'OAD',
          },
        ];

      const expectedResult = [
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
      ];
      const { orders } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(orders).toEqual(expectedResult);
    });
  });

  describe('reportHeader', () => {
    it('should return reportHeader that includes judge name and the currentDate in MMDDYY format', () => {
      (
        applicationContext.getUtilities().prepareDateFromString as jest.Mock
      ).mockReturnValue('2020-01-01');

      const { reportHeader } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(reportHeader).toBe(`${judgeUser.name} 01/01/20`);
    });
  });

  describe('showResultsTables', () => {
    it('should false when there are no orders, opinions, trial sessions and cases for the specified judge', () => {
      const { showResultsTables } = runCompute(judgeActivityReportHelper, {
        state: {
          ...baseState,
          judgeActivityReport: {
            ...baseState.judgeActivityReport,
            judgeActivityReportData: {},
          },
        },
      });

      expect(showResultsTables).toBe(false);
    });

    it('should true when there are orders, opinions, trial sessions or cases for the specified judge', () => {
      const { showResultsTables } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(showResultsTables).toBe(true);
    });
  });

  describe('showSelectDateRangeText', () => {
    it('should be false when the form has been submitted (there are orders, opinions, trial sessions and cases for the specified judge)', () => {
      const { showSelectDateRangeText } = runCompute(
        judgeActivityReportHelper,
        {
          state: baseState,
        },
      );

      expect(showSelectDateRangeText).toBe(false);
    });

    it('should true when form has NOT been submitted (there are orders, opinions, trial sessions or cases for the specified judge)', () => {
      const { showSelectDateRangeText } = runCompute(
        judgeActivityReportHelper,
        {
          state: {
            ...baseState,
            judgeActivityReport: {
              ...baseState.judgeActivityReport,
              judgeActivityReportData: {},
            },
          },
        },
      );

      expect(showSelectDateRangeText).toBe(true);
    });
  });

  describe('trialSessionsHeldTotal', () => {
    it('should be the sum of the values of trialSessions off state.judgeActivityReportData', () => {
      const { trialSessionsHeldTotal } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(trialSessionsHeldTotal).toBe(3);
    });
    it('should be 0 if state.judgeActivityReportData.trialSessions has not been set', () => {
      baseState.judgeActivityReport.judgeActivityReportData.trialSessions.total = 0;

      const { trialSessionsHeldTotal } = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });

      expect(trialSessionsHeldTotal).toBe(0);
    });
  });

  describe('progressDescriptionTableTotal', () => {
    mockSubmittedAndCavCasesByJudge = [];
    it('should be the sum of the number of cases off state.submittedAndCavCasesByJudge', () => {
      baseState.judgeActivityReport.judgeActivityReportData.submittedAndCavCasesByJudge =
        mockSubmittedAndCavCasesByJudge;

      baseState.judgeActivityReport.judgeActivityReportData.totalCountForSubmittedAndCavCases =
        mockSubmittedAndCavCasesByJudge.length;

      const { progressDescriptionTableTotal } = runCompute(
        judgeActivityReportHelper,
        {
          state: baseState,
        },
      );

      expect(progressDescriptionTableTotal).toBe(
        mockSubmittedAndCavCasesByJudge.length,
      );
    });
  });

  describe('submittedAndCavCasesByJudge', () => {
    beforeEach(() => {
      mockSubmittedAndCavCasesByJudge = [
        {
          daysElapsedSinceLastStatusChange: 1,
          docketNumber: '101-20',
          formattedCaseCount: 4,
          leadDocketNumber: '101-20',
        },
        {
          daysElapsedSinceLastStatusChange: 1,
          docketNumber: '110-15',
          formattedCaseCount: 1,
        },
        {
          daysElapsedSinceLastStatusChange: 1,
          docketNumber: '202-11',
          formattedCaseCount: 1,
        },
      ];
    });

    it('should return submittedAndCavCasesByJudge off of state.submittedAndCavCasesByJudge with computed values', () => {
      baseState.judgeActivityReport.judgeActivityReportData.submittedAndCavCasesByJudge =
        mockSubmittedAndCavCasesByJudge;

      const { submittedAndCavCasesByJudge } = runCompute(
        judgeActivityReportHelper,
        {
          state: baseState,
        },
      );

      const leadCase = submittedAndCavCasesByJudge.find(caseRecord => {
        return caseRecord.leadDocketNumber;
      });

      const unconsolidatedCases = submittedAndCavCasesByJudge.filter(
        caseRecord => {
          return !caseRecord.leadDocketNumber;
        },
      );

      expect(submittedAndCavCasesByJudge.length).toBe(3);
      expect(leadCase.consolidatedIconTooltipText).toBe('Lead case');
      expect(leadCase.isLeadCase).toBe(true);
      expect(leadCase.inConsolidatedGroup).toBe(true);
      expect(leadCase.formattedCaseCount).toBe(4);
      expect(leadCase.daysElapsedSinceLastStatusChange).toBe(1);

      expect(unconsolidatedCases.length).toBe(2);
      unconsolidatedCases.forEach(unconsolidatedCase => {
        expect(unconsolidatedCase.formattedCaseCount).toBe(1);
        expect(unconsolidatedCase.daysElapsedSinceLastStatusChange).toBe(1);
      });
    });

    it('should return submittedAndCavCasesByJudge off of state.submittedAndCavCasesByJudge sorted by daysElapsedSinceLastStatusChange in descending order', () => {
      baseState.judgeActivityReport.judgeActivityReportData.submittedAndCavCasesByJudge =
        mockSubmittedAndCavCasesByJudge;
      const { submittedAndCavCasesByJudge } = runCompute(
        judgeActivityReportHelper,
        {
          state: baseState,
        },
      );

      expect(submittedAndCavCasesByJudge.length).toBe(3);
      expect(
        submittedAndCavCasesByJudge[0].daysElapsedSinceLastStatusChange,
      ).toBe(1);
      expect(
        submittedAndCavCasesByJudge[1].daysElapsedSinceLastStatusChange,
      ).toBe(1);
      expect(
        submittedAndCavCasesByJudge[2].daysElapsedSinceLastStatusChange,
      ).toBe(1);
    });
  });

  describe('pageCount and showPaginator', () => {
    it('should return a pageCount of 1 and showPaginator as false for single page display', () => {
      baseState.judgeActivityReport.judgeActivityReportData.totalCountForSubmittedAndCavCases =
        mockTotalCountForSubmittedAndCavCases;
      baseState.judgeActivityReport.judgeActivityReportData.submittedAndCavCasesByJudge =
        mockSubmittedAndCavCasesByJudge;

      const result = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });
      expect(result.pageCount).toBe(1);
      expect(result.showPaginator).toBe(false);
    });

    it('should return a pageCount of 2 and showPaginator as true for multi-paginated page display', () => {
      baseState.judgeActivityReport.judgeActivityReportData.totalCountForSubmittedAndCavCases = 115;
      baseState.judgeActivityReport.judgeActivityReportData.submittedAndCavCasesByJudge =
        mockSubmittedAndCavCasesByJudge;

      const result = runCompute(judgeActivityReportHelper, {
        state: baseState,
      });
      expect(result.pageCount).toBe(2);
      expect(result.showPaginator).toBe(true);
    });
  });
});
