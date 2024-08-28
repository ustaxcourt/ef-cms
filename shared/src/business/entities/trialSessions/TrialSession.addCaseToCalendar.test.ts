import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSession } from './TrialSession';

describe('TrialSession entity', () => {
  describe('addCaseToCalendar', () => {
    it('should add case to calendar of valid trial session when provided a raw case entity with a docketNumber', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [],
        sessionType: 'Hybrid',
      });

      trialSession.addCaseToCalendar({ docketNumber: '123-45' });

      expect(trialSession.caseOrder![0]).toEqual({ docketNumber: '123-45' });
    });

    it('should add case to calendar once', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [],
        sessionType: 'Hybrid',
      });

      trialSession.addCaseToCalendar({ docketNumber: '123-45' });
      trialSession.addCaseToCalendar({ docketNumber: '123-45' });

      expect(trialSession.caseOrder![0]).toEqual({ docketNumber: '123-45' });
      expect(trialSession.caseOrder![1]).toBeUndefined();
    });
  });
});
