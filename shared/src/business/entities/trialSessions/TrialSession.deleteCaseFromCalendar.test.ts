import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSessionFactory } from './TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('deleteCaseFromCalendar', () => {
    it('should remove the expected case from the order', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_INPERSON,
          caseOrder: [{ docketNumber: '678-90' }, { docketNumber: '123-45' }],
        },
        applicationContext,
      );

      trialSession.deleteCaseFromCalendar({
        docketNumber: '123-45',
      });

      expect(trialSession.caseOrder).toEqual([{ docketNumber: '678-90' }]);
    });

    it('should remove the expected case from the order when there is only one entry', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_INPERSON,
          caseOrder: [{ docketNumber: '123-45' }],
        },
        applicationContext,
      );

      trialSession.deleteCaseFromCalendar({
        docketNumber: '123-45',
      });

      expect(trialSession.caseOrder).toEqual([]);
    });
  });
});
