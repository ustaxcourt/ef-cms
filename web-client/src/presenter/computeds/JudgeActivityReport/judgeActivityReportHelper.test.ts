import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from './judgeActivityReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('judgeActivityReportHelper', () => {
  const judgeActivityReportHelper = withAppContextDecorator(
    judgeActivityReportHelperComputed,
    { ...applicationContext },
  );

  it('should return all table total counts as 0 when the report has not yet been run', () => {
    const { closedCasesTotal, trialSessionsHeldTotal } = runCompute(
      judgeActivityReportHelper,
      {
        state: {
          judgeActivityReportData: {},
        },
      },
    );

    expect(closedCasesTotal).toBe(0);
    expect(trialSessionsHeldTotal).toBe(0);
  });

  describe('closedCasesTotal', () => {
    it('should be the sum of the values of cases closed off state.judgeActivityReportData', () => {
      const { closedCasesTotal } = runCompute(judgeActivityReportHelper, {
        state: {
          judgeActivityReportData: {
            casesClosedByJudge: {
              [CASE_STATUS_TYPES.closed]: 1,
              [CASE_STATUS_TYPES.closedDismissed]: 5,
            },
          },
        },
      });

      expect(closedCasesTotal).toBe(6);
    });
  });

  describe('trialSessionsHeldCount', () => {
    it('should be the sum of the values of trialSessions off state.judgeActivityReportData', () => {
      const { trialSessionsHeldTotal } = runCompute(judgeActivityReportHelper, {
        state: {
          judgeActivityReportData: {
            trialSessions: {
              [SESSION_TYPES.regular]: 1,
              [SESSION_TYPES.hybrid]: 0.5,
              [SESSION_TYPES.motionHearing]: 1.5,
            },
          },
        },
      });

      expect(trialSessionsHeldTotal).toBe(3);
    });
  });
});
