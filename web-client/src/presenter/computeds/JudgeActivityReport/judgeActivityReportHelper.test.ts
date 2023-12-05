import {
  ASCENDING,
  CASE_STATUS_TYPES,
  DESCENDING,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_SUBMITTED_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cloneDeep } from 'lodash';
import { initialJudgeActivityReportState } from '@web-client/presenter/judgeActivityReportState';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from './judgeActivityReportHelper';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('judgeActivityReportHelper', () => {
  let mockJudgeActivityReport;
  let baseState;

  let mockSubmittedAndCavCasesByJudge;

  const judgeActivityReportHelper = withAppContextDecorator(
    judgeActivityReportHelperComputed,
    { ...applicationContext },
  );

  beforeEach(() => {
    mockSubmittedAndCavCasesByJudge = [
      {
        ...MOCK_SUBMITTED_CASE,
        docketNumber: '101-20',
        formattedCaseCount: 4,
      },
      {
        ...MOCK_SUBMITTED_CASE,
        docketNumber: '103-20',
      },
      {
        ...MOCK_SUBMITTED_CASE,
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

    baseState = {
      judgeActivityReport: {
        filters: {},
        hasUserSubmittedForm: false,
        judgeActivityReportData: mockJudgeActivityReport,
        judgeNameToDisplayForHeader: judgeUser.name,
      },
      tableSort: {
        sortField: 'daysElapsedSinceLastStatusChange',
        sortOrder: ASCENDING,
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
    it('should return false when there are no orders, opinions, trial sessions and cases for the specified judge', () => {
      const { showResultsTables } = runCompute(judgeActivityReportHelper, {
        state: {
          ...baseState,
          judgeActivityReport: {
            ...baseState.judgeActivityReport,
            judgeActivityReportData:
              initialJudgeActivityReportState.judgeActivityReportData,
          },
        },
      });

      expect(showResultsTables).toBe(false);
    });

    it('should return true when there are orders, opinions, trial sessions or cases for the specified judge', () => {
      const { showResultsTables } = runCompute(judgeActivityReportHelper, {
        state: {
          ...baseState,
          judgeActivityReport: {
            ...baseState.judgeActivityReport,
            hasUserSubmittedForm: true,
          },
        },
      });

      expect(showResultsTables).toBe(true);
    });
  });

  describe('showSelectDateRangeText', () => {
    it('should be false when the form has been submitted (there are orders, opinions, trial sessions and cases for the specified judge)', () => {
      baseState.judgeActivityReport.hasUserSubmittedForm = true;
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
              judgeActivityReportData:
                initialJudgeActivityReportState.judgeActivityReportData,
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
          ...MOCK_SUBMITTED_CASE,
          docketNumber: '101-20',
          formattedCaseCount: 4,
          leadDocketNumber: '101-20',
        },
        {
          ...MOCK_SUBMITTED_CASE,
          docketNumber: '110-15',
          formattedCaseCount: 1,
        },
        {
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
      expect(unconsolidatedCases.length).toBe(2);
      unconsolidatedCases.forEach(unconsolidatedCase => {
        expect(unconsolidatedCase.formattedCaseCount).toBe(1);
      });
    });

    it('should sort by daysElapsedSinceLastStatusChange descending', () => {
      const state = cloneDeep(baseState);
      state.judgeActivityReport.judgeActivityReportData.submittedAndCavCasesByJudge =
        [
          {
            ...MOCK_SUBMITTED_CASE,
            caseStatusHistory: [
              {
                ...MOCK_SUBMITTED_CASE.caseStatusHistory[0],
                date: '2023-05-11T14:19:28.717Z',
              },
            ],
            docketNumber: '101-20',
            formattedCaseCount: 4,
          },
          {
            ...MOCK_SUBMITTED_CASE,
            caseStatusHistory: [
              {
                ...MOCK_SUBMITTED_CASE.caseStatusHistory[0],
                date: '2023-05-29T14:19:28.717Z',
              },
            ],
            docketNumber: '103-20',
          },
          {
            ...MOCK_SUBMITTED_CASE,
            caseStatusHistory: [
              {
                ...MOCK_SUBMITTED_CASE.caseStatusHistory[0],
                date: '2023-05-15T14:19:28.717Z',
              },
            ],
            docketNumber: '102-20',
          },
        ];
      state.tableSort = {
        sortField: 'daysElapsedSinceLastStatusChange',
        sortOrder: DESCENDING,
      };

      const { submittedAndCavCasesByJudge } = runCompute(
        judgeActivityReportHelper,
        {
          state,
        },
      );

      const expectedOrder = [
        {
          docketNumber: '101-20',
          statusDate: '05/11/23',
        },
        {
          docketNumber: '102-20',
          statusDate: '05/15/23',
        },
        {
          docketNumber: '103-20',
          statusDate: '05/29/23',
        },
      ];
      const actualOrder = submittedAndCavCasesByJudge.map(c => ({
        docketNumber: c.docketNumber,
        statusDate: c.statusDate,
      }));
      expect(actualOrder).toEqual(expectedOrder);
    });

    it('should sort by associatedJudge descending', () => {
      const state = cloneDeep(baseState);
      state.judgeActivityReport.judgeActivityReportData.submittedAndCavCasesByJudge =
        [
          {
            ...MOCK_SUBMITTED_CASE,
            associatedJudge: 'Colvin',
            docketNumber: '101-20',
            formattedCaseCount: 4,
          },
          {
            ...MOCK_SUBMITTED_CASE,
            associatedJudge: 'Buch',
            docketNumber: '103-20',
          },
          {
            ...MOCK_SUBMITTED_CASE,
            associatedJudge: 'Sotomayor',
            docketNumber: '102-20',
          },
        ];
      state.tableSort = {
        sortField: 'associatedJudge',
        sortOrder: DESCENDING,
      };

      const { submittedAndCavCasesByJudge } = runCompute(
        judgeActivityReportHelper,
        {
          state,
        },
      );

      const expectedOrder = [
        {
          associatedJudge: 'Sotomayor',
          docketNumber: '102-20',
        },
        {
          associatedJudge: 'Colvin',
          docketNumber: '101-20',
        },
        {
          associatedJudge: 'Buch',
          docketNumber: '103-20',
        },
      ];
      const actualOrder = submittedAndCavCasesByJudge.map(c => ({
        associatedJudge: c.associatedJudge,
        docketNumber: c.docketNumber,
      }));
      expect(actualOrder).toEqual(expectedOrder);
    });

    it('should always secondarily sort by days elapsed since last status change descending', () => {
      const state = cloneDeep(baseState);
      state.judgeActivityReport.judgeActivityReportData.submittedAndCavCasesByJudge =
        [
          {
            ...MOCK_SUBMITTED_CASE,
            associatedJudge: 'Colvin',
            caseStatusHistory: [
              {
                ...MOCK_SUBMITTED_CASE.caseStatusHistory[0],
                date: '2015-05-11T14:19:28.717Z',
              },
            ],
            docketNumber: '101-20',
          },
          {
            ...MOCK_SUBMITTED_CASE,
            associatedJudge: 'Ashford',
            caseStatusHistory: [
              {
                ...MOCK_SUBMITTED_CASE.caseStatusHistory[0],
                date: '2023-05-11T14:19:28.717Z',
              },
            ],
            docketNumber: '103-20',
          },
          {
            ...MOCK_SUBMITTED_CASE,
            associatedJudge: 'Colvin',
            caseStatusHistory: [
              {
                ...MOCK_SUBMITTED_CASE.caseStatusHistory[0],
                date: '2023-05-11T14:19:28.717Z',
              },
            ],
            docketNumber: '102-20',
          },
          {
            ...MOCK_SUBMITTED_CASE,
            associatedJudge: 'Colvin',
            caseStatusHistory: [
              {
                ...MOCK_SUBMITTED_CASE.caseStatusHistory[0],
                date: '2017-05-11T14:19:28.717Z',
              },
            ],
            docketNumber: '104-20',
          },
        ];
      state.tableSort = {
        sortField: 'associatedJudge',
        sortOrder: DESCENDING,
      };

      const { submittedAndCavCasesByJudge } = runCompute(
        judgeActivityReportHelper,
        {
          state,
        },
      );

      const expectedOrder = [
        {
          associatedJudge: 'Colvin',
          docketNumber: '101-20',
        },
        {
          associatedJudge: 'Colvin',
          docketNumber: '104-20',
        },
        {
          associatedJudge: 'Colvin',
          docketNumber: '102-20',
        },
        {
          associatedJudge: 'Ashford',
          docketNumber: '103-20',
        },
      ];
      const actualOrder = submittedAndCavCasesByJudge.map(c => ({
        associatedJudge: c.associatedJudge,
        docketNumber: c.docketNumber,
      }));
      expect(actualOrder).toEqual(expectedOrder);
    });
  });
});
