const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { TRIAL_SESSION_PROCEEDING_TYPES } = require('../EntityConstants');
const { TrialSession } = require('./TrialSession');
const { VALID_TRIAL_SESSION } = require('./TrialSession.test');

describe('TrialSession entity', () => {
  describe('canSetAsCalendared', () => {
    it('should be able to set a trial session as calendared if all properties are not empty for an in-person session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: { name: 'Judge Colvin' },
          postalCode: '12345',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.canSetAsCalendared()).toBeTruthy();
    });

    it('should NOT be able to set a trial session as calendared if one or more properties are empty for an in-person session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: {},
          postalCode: '12345',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.canSetAsCalendared()).toBeFalsy();
    });

    it('should be able to set a trial session as calendared if all properties are not empty for a remote session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          chambersPhoneNumber: '111111',
          joinPhoneNumber: '222222',
          judge: { name: 'Judge Colvin' },
          meetingId: '333333',
          password: '4444444',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.canSetAsCalendared()).toBeTruthy();
    });

    it('should NOT be able to set a trial session as calendared if one or more properties are empty for a remote session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          judge: {},
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.canSetAsCalendared()).toBeFalsy();
    });
  });
});
