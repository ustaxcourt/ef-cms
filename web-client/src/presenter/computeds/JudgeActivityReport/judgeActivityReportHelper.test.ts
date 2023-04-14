import { SESSION_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from './judgeActivityReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('judgeActivityReportHelper', () => {
  const judgeActivityReportHelper = withAppContextDecorator(
    judgeActivityReportHelperComputed,
    { ...applicationContext },
  );

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
