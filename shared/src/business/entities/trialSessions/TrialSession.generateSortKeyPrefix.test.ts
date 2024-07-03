import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { TrialSession } from './TrialSession';

describe('TrialSession entity', () => {
  describe('generateSortKeyPrefix', () => {
    it('should generate correct sort key prefix for a regular trial session', () => {
      const trialSession = new TrialSession(MOCK_TRIAL_REGULAR);

      expect(trialSession.generateSortKeyPrefix()).toEqual(
        'BirminghamAlabama-R',
      );
    });

    it('should generate correct sort key prefix for a small trial session', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_REGULAR,
        sessionType: 'Small',
      });

      expect(trialSession.generateSortKeyPrefix()).toEqual(
        'BirminghamAlabama-S',
      );
    });

    it('should generate correct sort key prefix for a hybrid trial session', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_REGULAR,
        sessionType: 'Hybrid',
      });

      expect(trialSession.generateSortKeyPrefix()).toEqual(
        'BirminghamAlabama-H',
      );
    });
  });
});
