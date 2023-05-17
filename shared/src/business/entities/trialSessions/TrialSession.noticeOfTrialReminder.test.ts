const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { TrialSession } = require('./TrialSession');
const { VALID_TRIAL_SESSION } = require('./TrialSession.test');
import { prepareDateFromString } from '../../utilities/DateHandler';

describe('TrialSession entity', () => {
  describe('Notice of trial reminder', () => {
    const today = prepareDateFromString();
    // 5 day buffer to display the reminder PLUS 1 more day (the 30th day from the trial)
    const tests = [
      { daysFromToday: 28, expectedOutput: false },
      { daysFromToday: 29, expectedOutput: true },
      { daysFromToday: 30, expectedOutput: true },
      { daysFromToday: 31, expectedOutput: true },
      { daysFromToday: 32, expectedOutput: true },
      { daysFromToday: 33, expectedOutput: true },
      { daysFromToday: 34, expectedOutput: true },
      { daysFromToday: 35, expectedOutput: false },
    ];
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

    tests.forEach(({ daysFromToday, expectedOutput }) => {
      it(`should set isStartDateWithinNOTTReminderRange to ${expectedOutput} when the trial session is calendared and the start date is ${daysFromToday} days from today`, () => {
        const thirtyDaysFromToday = today.plus({ ['days']: daysFromToday });

        const trialSession = new TrialSession(
          {
            ...VALID_TRIAL_SESSION,
            isCalendared: true,
            startDate: thirtyDaysFromToday,
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.isStartDateWithinNOTTReminderRange).toBe(
          expectedOutput,
        );
      });
    });
  });
});
