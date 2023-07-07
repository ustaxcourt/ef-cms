import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { OpenTrialSession } from './OpenTrialSession';
import { SESSION_STATUS_TYPES } from '../EntityConstants';

describe('TrialSession entity', () => {
  describe('setNoticesIssued', () => {
    it('should set the noticeIssuedDate on the trial session', () => {
      const trialSession = new OpenTrialSession({
        ...MOCK_TRIAL_INPERSON,
        sessionStatus: SESSION_STATUS_TYPES.open,
      });

      trialSession.setNoticesIssued();

      expect(trialSession.noticeIssuedDate).toBeDefined();
    });
  });
});
