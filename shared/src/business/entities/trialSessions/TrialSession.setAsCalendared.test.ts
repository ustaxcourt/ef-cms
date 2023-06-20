import { TrialSession } from './TrialSession';
import { VALID_TRIAL_SESSION } from './TrialSession.test';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('setAsCalendared', () => {
    it('should set a valid trial session entity as calendared upon request', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      trialSession.setAsCalendared();
      expect(trialSession.isCalendared).toEqual(true);
    });
  });
});
