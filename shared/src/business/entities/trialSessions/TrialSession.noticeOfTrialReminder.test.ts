const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { TrialSession } = require('./TrialSession');
const { VALID_TRIAL_SESSION } = require('./TrialSession.test');
import { prepareDateFromString } from '../../utilities/DateHandler';

describe('TrialSession entity', () => {
  describe('Notice of trial reminder', () => {
    const today = prepareDateFromString();
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

    it('should set isStartDateWithinNOTTReminderRange to true when the trial session is calendared and the start date is 30 days from today', () => {
      const thirtyDaysFromToday = today.plus({ ['days']: 30 });

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

      expect(trialSession.isStartDateWithinNOTTReminderRange).toBe(true);
    });

    it('should set isStartDateWithinNOTTReminderRange to true when the trial session is calendared and the start date is 35 days from today', () => {
      const thirtyFiveDaysFromToday = today.plus({ ['days']: 35 });

      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          isCalendared: true,
          startDate: thirtyFiveDaysFromToday,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isStartDateWithinNOTTReminderRange).toBe(true);
    });

    it('should set isStartDateWithinNOTTReminderRange to false when the trial session is calendared and the start date is 29 days from today', () => {
      const twentyNineDaysFromToday = today.plus({ ['days']: 29 });

      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          isCalendared: true,
          startDate: twentyNineDaysFromToday,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isStartDateWithinNOTTReminderRange).toBe(false);
    });

    it('should set isStartDateWithinNOTTReminderRange to false when the trial session is calendared and the start date is 36 days from today', () => {
      const thirtySixDaysFromToday = today.plus({ ['days']: 36 });

      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          isCalendared: true,
          startDate: thirtySixDaysFromToday,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isStartDateWithinNOTTReminderRange).toBe(false);
    });
  });
});
