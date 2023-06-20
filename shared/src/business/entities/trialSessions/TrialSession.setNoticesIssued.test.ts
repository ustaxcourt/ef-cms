import { TrialSession } from './TrialSession';
import { VALID_TRIAL_SESSION } from './TrialSession.test';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('setNoticesIssued', () => {
    it('Should set the noticeIssuedDate on the trial session', () => {
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
