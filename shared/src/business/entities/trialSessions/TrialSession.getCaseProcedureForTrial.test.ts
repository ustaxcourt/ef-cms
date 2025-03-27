import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSession } from './TrialSession';

describe('TrialSession entity', () => {
  describe('getCaseProcedureForTrial', () => {
    it('should return the correct procedure for a regular trial session', () => {
      const trialSession = new TrialSession(MOCK_TRIAL_REGULAR);

      expect(trialSession.getCaseProcedureForTrial()).toEqual(
        SESSION_TYPES.regular,
      );
    });

    it('should return the correct procedure for a small trial session', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.small,
      });

      expect(trialSession.getCaseProcedureForTrial()).toEqual(
        SESSION_TYPES.small,
      );
    });

    it('should return the correct procedure for a hybrid trial session', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.hybrid,
      });

      expect(trialSession.getCaseProcedureForTrial()).toEqual(
        SESSION_TYPES.hybrid,
      );
    });
  });
});
