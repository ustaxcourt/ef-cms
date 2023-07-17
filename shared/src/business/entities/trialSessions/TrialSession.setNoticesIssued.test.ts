import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSession } from './TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('setNoticesIssued', () => {
    it('should set the noticeIssuedDate on the trial session', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_INPERSON,
          noticeIssuedDate: undefined,
        },
        {
          applicationContext,
        },
      );

      trialSession.setNoticesIssued();

      expect(trialSession.noticeIssuedDate).toBeDefined();
    });
  });
});
