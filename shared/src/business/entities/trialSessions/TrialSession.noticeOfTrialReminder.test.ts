const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { TrialSession } = require('./TrialSession');
const { VALID_TRIAL_SESSION } = require('./TrialSession.test');
import { isTodayWithinGivenInterval } from '../../utilities/DateHandler';

jest.mock('../../utilities/DateHandler', () => {
  const originalModule = jest.requireActual('../../utilities/DateHandler');
  return {
    __esModule: true,
    ...originalModule,
    isTodayWithinGivenInterval: jest.fn(),
  };
});

describe('TrialSession entity', () => {
  describe('Notice of trial reminder', () => {
    it('should set isStartDateWithinNOTTReminderRange to false when the trial session is not calendared', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          isCalendared: false,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isStartDateWithinNOTTReminderRange).toBe(false);
    });

    it('should set isStartDateWithinNOTTReminderRange to true when the trial session is calendared and the trial date falls within the specified date range', () => {
      const mockIsTodayWithinGivenInterval =
        isTodayWithinGivenInterval as jest.Mock;
      mockIsTodayWithinGivenInterval.mockReturnValue(true);

      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          isCalendared: true,
          startDate: '10/10/2020',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isStartDateWithinNOTTReminderRange).toBe(true);
    });
  });
});
