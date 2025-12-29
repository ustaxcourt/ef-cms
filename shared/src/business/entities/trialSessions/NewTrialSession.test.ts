import { TrialSessionTypes } from '@shared/business/entities/EntityConstants';
import { MOCK_NEW_TRIAL_REMOTE } from '../../../test/mockTrial';
import { NewTrialSession } from './NewTrialSession';

describe('NewTrialSession entity', () => {
  describe('isValid', () => {
    it('should return true when the trial session has all required and valid data', () => {
      const trialSession = new NewTrialSession(MOCK_NEW_TRIAL_REMOTE);

      expect(trialSession.isValid()).toEqual(true);
    });

    it('should be false when the trial session start date is in the past', () => {
      const trialSession = new NewTrialSession({
        ...MOCK_NEW_TRIAL_REMOTE,
        startDate: '2000-03-01T00:00:00.000Z',
      });

      expect(trialSession.isValid()).toEqual(false);
    });

    it('should be false when the trial session type is not valid', () => {
      const trialSession = new NewTrialSession({
        ...MOCK_NEW_TRIAL_REMOTE,
        sessionType: 'Something Else' as TrialSessionTypes,
      });

      expect(trialSession.isValid()).toEqual(false);
    });
  });

  describe('validate', () => {
    it('should do nothing when the trial session is valid', () => {
      const trialSession = new NewTrialSession(MOCK_NEW_TRIAL_REMOTE);

      expect(() => trialSession.validate()).not.toThrow();
    });

    it('should throw an error when the trial session is invalid', () => {
      const trialSession = new NewTrialSession({} as any);

      expect(() => trialSession.validate()).toThrow();
    });

    it('should throw an error when a valid alternateTrialClerkName is not provided and only when "Other" is selected', () => {
      const trialSession = new NewTrialSession({
        ...MOCK_NEW_TRIAL_REMOTE,
        trialClerkId: 'Other',
      });

      expect(() => trialSession.validate()).toThrow();
    });
  });

  describe('estimatedEndDate', () => {
    it('should be invalid when estimatedEndDate is not provided', () => {
      const trialSession = new NewTrialSession({
        ...MOCK_NEW_TRIAL_REMOTE,
        estimatedEndDate: undefined,
      });

      expect(trialSession.isValid()).toEqual(false);
      expect(trialSession.getFormattedValidationErrors()).toMatchObject({
        estimatedEndDate: 'Enter a valid estimated end date',
      });
    });

    it('should be invalid when estimatedEndDate is before startDate', () => {
      const trialSession = new NewTrialSession({
        ...MOCK_NEW_TRIAL_REMOTE,
        estimatedEndDate: '2027-11-01T00:00:00.000Z',
        startDate: '2027-11-11T00:00:00.000Z',
      });

      expect(trialSession.isValid()).toEqual(false);
      expect(trialSession.getFormattedValidationErrors()).toMatchObject({
        estimatedEndDate: 'Enter a valid estimated end date',
      });
    });

    it('should be valid when estimatedEndDate is equal to startDate', () => {
      const trialSession = new NewTrialSession({
        ...MOCK_NEW_TRIAL_REMOTE,
        estimatedEndDate: '2027-11-11T00:00:00.000Z',
        startDate: '2027-11-11T00:00:00.000Z',
      });

      expect(trialSession.isValid()).toEqual(true);
    });

    it('should be valid when estimatedEndDate is after startDate', () => {
      const trialSession = new NewTrialSession({
        ...MOCK_NEW_TRIAL_REMOTE,
        estimatedEndDate: '2027-11-15T00:00:00.000Z',
        startDate: '2027-11-11T00:00:00.000Z',
      });

      expect(trialSession.isValid()).toEqual(true);
    });
  });
});
