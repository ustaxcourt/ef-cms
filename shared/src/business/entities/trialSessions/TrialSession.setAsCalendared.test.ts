import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSession } from './TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('setAsCalendared', () => {
    it('should set a valid trial session entity as calendared upon request', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_INPERSON,
          isCalendared: false,
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
