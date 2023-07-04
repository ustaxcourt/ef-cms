import {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REMOTE,
} from '../../../test/mockTrial';
import { TrialSessionFactory } from './TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('getEmptyFields', () => {
    it('should return all missing fields as a list for an in-person session', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_INPERSON,
          address1: undefined,
          chambersPhoneNumber: undefined,
          city: undefined,
          judge: undefined,
          postalCode: undefined,
          state: undefined,
        },

        applicationContext,
      );

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([
        'address1',
        'city',
        'state',
        'postalCode',
        'judge',
        'chambersPhoneNumber',
      ]);
    });

    it('should return an empty list when all required fields as set for an in-person session', () => {
      const trialSession = TrialSessionFactory(
        MOCK_TRIAL_INPERSON,
        applicationContext,
      );

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([]);
    });

    it('should return all missing fields as a list for a remote session', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_REMOTE,
          chambersPhoneNumber: undefined,
          joinPhoneNumber: undefined,
          judge: undefined,
          meetingId: undefined,
          password: undefined,
        },

        applicationContext,
      );

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([
        'chambersPhoneNumber',
        'joinPhoneNumber',
        'meetingId',
        'password',
        'judge',
      ]);
    });

    it('should return an empty list when all required fields as set for a remote session', () => {
      const trialSession = TrialSessionFactory(MOCK_TRIAL_REMOTE, {
        applicationContext,
      });

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([]);
    });
  });
});
