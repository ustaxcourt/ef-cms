import { MOCK_NEW_TRIAL_REMOTE } from '../../../test/mockTrial';
import { NewTrialSession } from './NewTrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('NewTrialSession entity', () => {
  it('should throw an error when application context is not passed in to the constructor', () => {
    expect(
      () => new NewTrialSession(MOCK_NEW_TRIAL_REMOTE, {} as any),
    ).toThrow();
  });

  describe('isValid', () => {
    it('should return true when the trial session has all required and valid data', () => {
      const trialSession = new NewTrialSession(MOCK_NEW_TRIAL_REMOTE, {
        applicationContext,
      });

      expect(trialSession.isValid()).toEqual(true);
    });

    it('should be false when the trial session start date is in the past', () => {
      const trialSession = new NewTrialSession(
        {
          ...MOCK_NEW_TRIAL_REMOTE,
          startDate: '2000-03-01T00:00:00.000Z',
        },
        { applicationContext },
      );

      expect(trialSession.isValid()).toEqual(false);
    });

    it('should be false when the trial session type is not valid', () => {
      const trialSession = new NewTrialSession(
        {
          ...MOCK_NEW_TRIAL_REMOTE,
          sessionType: 'Something Else',
        },
        { applicationContext },
      );

      expect(trialSession.isValid()).toEqual(false);
    });
  });

  describe('validate', () => {
    it('should do nothing when the trial session is valid', () => {
      const trialSession = new NewTrialSession(MOCK_NEW_TRIAL_REMOTE, {
        applicationContext,
      });

      expect(() => trialSession.validate()).not.toThrow();
    });

    it('should throw an error when the trial session is invalid', () => {
      const trialSession = new NewTrialSession({} as any, {
        applicationContext,
      });

      expect(() => trialSession.validate()).toThrow();
    });

    it('should throw an error when a valid alternateTrialClerkName is not provided and only when "Other" is selected', () => {
      const trialSession = new NewTrialSession(
        { ...MOCK_NEW_TRIAL_REMOTE, trialClerkId: 'Other' },
        { applicationContext },
      );

      expect(() => trialSession.validate()).toThrow();
    });
  });
});
