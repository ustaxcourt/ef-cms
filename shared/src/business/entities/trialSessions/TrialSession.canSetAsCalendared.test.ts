import {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REMOTE,
} from '../../../test/mockTrial';
import { TrialSession } from './TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('canSetAsCalendared', () => {
    it('should be able to set a trial session as calendared when all properties are not empty for an in-person session', () => {
      const trialSession = new TrialSession(MOCK_TRIAL_INPERSON, {
        applicationContext,
      });

      expect(trialSession.canSetAsCalendared()).toEqual(true);
    });

    it('should NOT be able to set a trial session as calendared when one or more properties are empty for an in-person session', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_INPERSON,
          judge: {},
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.canSetAsCalendared()).toEqual(false);
    });

    it('should be able to set a trial session as calendared when all properties are not empty for a remote session', () => {
      const trialSession = new TrialSession(MOCK_TRIAL_REMOTE, {
        applicationContext,
      });

      expect(trialSession.canSetAsCalendared()).toEqual(true);
    });

    it('should NOT be able to set a trial session as calendared when one or more properties are empty for a remote session', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REMOTE,
          judge: {},
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.canSetAsCalendared()).toEqual(false);
    });
  });
});
