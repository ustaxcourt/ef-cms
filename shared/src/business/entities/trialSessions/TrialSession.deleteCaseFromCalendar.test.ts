import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSession } from './TrialSession';

describe('TrialSession entity', () => {
  describe('deleteCaseFromCalendar', () => {
    it('should remove the expected case from the order', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [{ docketNumber: '678-90' }, { docketNumber: '123-45' }],
      });

      trialSession.deleteCaseFromCalendar({
        docketNumber: '123-45',
      });

      expect(trialSession.caseOrder).toEqual([{ docketNumber: '678-90' }]);
    });

    it('should remove the expected case from the order when there is only one entry', () => {
      const trialSession = new TrialSession({
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [{ docketNumber: '123-45' }],
      });

      trialSession.deleteCaseFromCalendar({
        docketNumber: '123-45',
      });

      expect(trialSession.caseOrder).toEqual([]);
    });
  });
});
