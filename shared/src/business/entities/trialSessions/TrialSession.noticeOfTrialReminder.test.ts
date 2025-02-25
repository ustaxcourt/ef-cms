import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { TrialSession } from './TrialSession';
import { prepareDateFromString } from '../../utilities/DateHandler';

describe('TrialSession entity', () => {
  describe('Notice of trial reminder', () => {
    const today = prepareDateFromString();
    // 9 day buffer to display the reminder PLUS 1 more day (the 25th day [inclusive] from the trial)
    const tests = [
      { daysFromToday: 24, expectedOutput: false },
      { daysFromToday: 25, expectedOutput: true },
      { daysFromToday: 26, expectedOutput: true },
      { daysFromToday: 27, expectedOutput: true },
      { daysFromToday: 28, expectedOutput: true },
      { daysFromToday: 29, expectedOutput: true },
      { daysFromToday: 30, expectedOutput: true },
      { daysFromToday: 31, expectedOutput: true },
      { daysFromToday: 32, expectedOutput: true },
      { daysFromToday: 33, expectedOutput: true },
      { daysFromToday: 34, expectedOutput: true },
      { daysFromToday: 35, expectedOutput: false },
    ];
    it('should return false when the trial session is not calendared', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_REGULAR,
        isCalendared: false,
      });

      expect(
        TrialSession.isStartDateWithinNOTTReminderRange({
          isCalendared: trialSession.isCalendared,
          startDate: trialSession.startDate,
        }),
      ).toBe(false);
    });

    tests.forEach(({ daysFromToday, expectedOutput }) => {
      it(`should return ${expectedOutput} when the trial session is calendared and the start date is ${daysFromToday} days from today`, () => {
        const thirtyDaysFromToday = today.plus({ ['days']: daysFromToday });

        const trialSession = new TrialSession({
          ...MOCK_TRIAL_REGULAR,
          isCalendared: true,
          startDate: thirtyDaysFromToday,
        });

        expect(
          TrialSession.isStartDateWithinNOTTReminderRange({
            isCalendared: trialSession.isCalendared,
            startDate: trialSession.startDate,
          }),
        ).toBe(expectedOutput);
      });
    });
  });
});
