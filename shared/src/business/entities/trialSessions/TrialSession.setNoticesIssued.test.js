const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { TrialSession } = require('./TrialSession');
const { VALID_TRIAL_SESSION } = require('./TrialSession.test');

describe('TrialSession entity', () => {
  describe('setNoticesIssued', () => {
    it('Should set the noticeIssuedDate on the trial session', async () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: {},
          postalCode: '12345',
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.noticeIssuedDate).toBeFalsy();

      trialSession.setNoticesIssued();

      expect(trialSession.noticeIssuedDate).toBeTruthy();
    });
  });
});
