const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { TRIAL_SESSION_PROCEEDING_TYPES } = require('../EntityConstants');
const { TrialSession } = require('./TrialSession');
const { VALID_TRIAL_SESSION } = require('./TrialSession.test');

describe('TrialSession entity', () => {
  describe('getEmptyFields', () => {
    it('should return all missing fields as a list for an in-person session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        },
        {
          applicationContext,
        },
      );

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([
        'address1',
        'city',
        'state',
        'postalCode',
        'judge',
      ]);
    });

    it('should return an empty list when all required fields as set for an in-person session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: { name: 'Judge Colvin' },
          postalCode: '12345',
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([]);
    });

    it('should return all missing fields as a list for a remote session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
        {
          applicationContext,
        },
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
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          chambersPhoneNumber: '1111111',
          joinPhoneNumber: '22222222',
          judge: {
            name: 'Mary Kate',
            userId: '711cee39-5747-4f6c-8f0d-89177bf2da36',
          },
          meetingId: '12345678',
          password: '0987654321',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
        {
          applicationContext,
        },
      );

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([]);
    });
  });
});
