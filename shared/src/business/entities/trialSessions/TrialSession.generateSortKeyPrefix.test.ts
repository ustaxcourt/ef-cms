import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { TrialSessionFactory } from './TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('generateSortKeyPrefix', () => {
    it('should generate correct sort key prefix for a regular trial session', () => {
      const trialSession = TrialSessionFactory(
        MOCK_TRIAL_REGULAR,
        applicationContext,
      );

      expect(trialSession.generateSortKeyPrefix()).toEqual(
        'BirminghamAlabama-R',
      );
    });

    it('should generate correct sort key prefix for a small trial session', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_REGULAR,
          sessionType: 'Small',
        },

        applicationContext,
      );

      expect(trialSession.generateSortKeyPrefix()).toEqual(
        'BirminghamAlabama-S',
      );
    });

    it('should generate correct sort key prefix for a hybrid trial session', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_REGULAR,
          sessionType: 'Hybrid',
        },

        applicationContext,
      );

      expect(trialSession.generateSortKeyPrefix()).toEqual(
        'BirminghamAlabama-H',
      );
    });
  });
});
