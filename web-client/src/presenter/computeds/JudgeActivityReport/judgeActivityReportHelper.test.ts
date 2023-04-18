import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from './judgeActivityReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('judgeActivityReportHelper', () => {
  let mockJudgeActivityReport;
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
  });

  describe('closedCasesTotal', () => {
    it('should be the sum of the values of cases closed off state.judgeActivityReportData', () => {
      const { closedCasesTotal } = runCompute(judgeActivityReportHelper, {
        state: {
          judgeActivityReportData: mockJudgeActivityReport,
        },
      });

      expect(closedCasesTotal).toBe(6);
    });
  });

  it('should return currentDate in MMDDYY format', () => {
    applicationContext
      .getUtilities()
      .prepareDateFromString.mockReturnValue('2020-01-01');

    const { currentDate } = runCompute(judgeActivityReportHelper, {
      state: {
        judgeActivityReportData: mockJudgeActivityReport,
      },
    });

    expect(currentDate).toBe('01/01/20');
  });

  describe('trialSessionsHeldCount', () => {
    it('should be the sum of the values of trialSessions off state.judgeActivityReportData', () => {
      const { trialSessionsHeldTotal } = runCompute(judgeActivityReportHelper, {
        state: {
          judgeActivityReportData: mockJudgeActivityReport,
        },
      });

      expect(trialSessionsHeldTotal).toBe(3);
    });
  });

  describe('opinionsFiledTotal', () => {
    it('should be the sum of the values of opinions filed off state.judgeActivityReportData', () => {
      const { opinionsFiledTotal } = runCompute(judgeActivityReportHelper, {
        state: {
          judgeActivityReportData: mockJudgeActivityReport,
        },
      });

      expect(opinionsFiledTotal).toBe(5);
    });
  });

  describe('ordersFiledTotal', () => {
    it('should be the sum of the values of orders filed off state.judgeActivityReportData', () => {
      const { ordersFiledTotal } = runCompute(judgeActivityReportHelper, {
        state: {
          judgeActivityReportData: mockJudgeActivityReport,
        },
      });

      expect(ordersFiledTotal).toBe(6);
    });
  });

  describe('showResults', () => {
    it('should false when there are no orders, opinions, trial sessions and cases for the specified judge', () => {
      const { showResults } = runCompute(judgeActivityReportHelper, {
        state: {
          judgeActivityReportData: {},
        },
      });

      expect(showResults).toBe(false);
    });

    it('should true when there are orders, opinions, trial sessions or cases for the specified judge', () => {
      const { showResults } = runCompute(judgeActivityReportHelper, {
        state: {
          judgeActivityReportData: mockJudgeActivityReport,
        },
      });

      expect(showResults).toBe(true);
    });
  });

  describe('showDateRangeMessage', () => {
    it('should be false when the form has been submitted (there are orders, opinions, trial sessions and cases for the specified judge)', () => {
      const { showDateRangeMessage } = runCompute(judgeActivityReportHelper, {
        state: {
          judgeActivityReportData: mockJudgeActivityReport,
        },
      });

      expect(showDateRangeMessage).toBe(false);
    });

    it('should true when form has NOT been submitted (there are orders, opinions, trial sessions or cases for the specified judge)', () => {
      const { showDateRangeMessage } = runCompute(judgeActivityReportHelper, {
        state: {
          judgeActivityReportData: {},
        },
      });

      expect(showDateRangeMessage).toBe(true);
    });
  });
});
