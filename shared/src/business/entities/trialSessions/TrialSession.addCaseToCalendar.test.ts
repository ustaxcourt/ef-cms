import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSession } from './TrialSession';

describe('TrialSession entity', () => {
  describe('addCaseToCalendar', () => {
    it('should add case to calendar of valid trial session when provided a raw case entity with a docketNumber', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [],
        sessionType: SESSION_TYPES.hybrid,
      });

      trialSession.addCaseToCalendar({ docketNumber: '123-45' });

      expect(trialSession.caseOrder![0]).toMatchObject({
        docketNumber: '123-45',
        isHearing: false,
        isManuallyAdded: false,
        addedToSessionAt: expect.anything(),
      });
    });

    it('should add case to calendar once', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [],
        sessionType: SESSION_TYPES.hybrid,
      });

      trialSession.addCaseToCalendar({ docketNumber: '123-45' });
      trialSession.addCaseToCalendar({ docketNumber: '123-45' });

      expect(trialSession.caseOrder![0]).toMatchObject({
        docketNumber: '123-45',
        isHearing: false,
        isManuallyAdded: false,
        addedToSessionAt: expect.anything(),
      });
      expect(trialSession.caseOrder![1]).toBeUndefined();
    });
  });
});
