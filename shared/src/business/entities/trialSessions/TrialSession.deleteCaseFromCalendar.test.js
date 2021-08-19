const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { TrialSession } = require('./TrialSession');
const { VALID_TRIAL_SESSION } = require('./TrialSession.test');

describe('TrialSession entity', () => {
  describe('deleteCaseFromCalendar', () => {
    it('should remove the expected case from the order', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          caseOrder: [{ docketNumber: '678-90' }, { docketNumber: '123-45' }],
        },
        {
          applicationContext,
        },
      );

      trialSession.deleteCaseFromCalendar({
        docketNumber: '123-45',
      });

      expect(trialSession.caseOrder).toEqual([{ docketNumber: '678-90' }]);
    });

    it('should remove the expected case from the order when there is only one entry', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          caseOrder: [{ docketNumber: '123-45' }],
        },
        {
          applicationContext,
        },
      );

      trialSession.deleteCaseFromCalendar({
        docketNumber: '123-45',
      });

      expect(trialSession.caseOrder).toEqual([]);
    });
  });
});
