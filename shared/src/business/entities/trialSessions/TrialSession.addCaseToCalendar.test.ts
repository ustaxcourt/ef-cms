import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSessionFactory } from './TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('addCaseToCalendar', () => {
    it('should add case to calendar of valid trial session when provided a raw case entity with a docketNumber', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_INPERSON,
          caseOrder: [],
          sessionType: 'Hybrid',
        },
        applicationContext,
      );

      trialSession.addCaseToCalendar({ docketNumber: '123-45' });

      expect(trialSession.caseOrder![0]).toEqual({ docketNumber: '123-45' });
    });

    it('should add case to calendar once', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_INPERSON,
          caseOrder: [],
          sessionType: 'Hybrid',
        },

        applicationContext,
      );

      trialSession.addCaseToCalendar({ docketNumber: '123-45' });
      trialSession.addCaseToCalendar({ docketNumber: '123-45' });

      expect(trialSession.caseOrder![0]).toEqual({ docketNumber: '123-45' });
      expect(trialSession.caseOrder![1]).toBeUndefined();
    });
  });
});
