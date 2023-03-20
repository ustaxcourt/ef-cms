const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  SESSION_STATUS_GROUPS,
  TRIAL_SESSION_SCOPE_TYPES,
} = require('../EntityConstants');
const { TrialSession } = require('./TrialSession');
const { VALID_TRIAL_SESSION } = require('./TrialSession.test');

describe('TrialSession entity', () => {
  describe('removeCaseFromCalendar', () => {
    it('should set case on calendar to removedFromTrial with removedFromTrialDate and disposition', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      trialSession.addCaseToCalendar({ docketNumber: '123-45' });
      trialSession.addCaseToCalendar({ docketNumber: '234-45' });
      trialSession.addCaseToCalendar({ docketNumber: '456-45' });
      expect(trialSession.caseOrder.length).toEqual(3);

      trialSession.removeCaseFromCalendar({
        disposition: 'because',
        docketNumber: '123-45',
      });

      expect(trialSession.caseOrder.length).toEqual(3);
      expect(trialSession.caseOrder[0]).toMatchObject({
        disposition: 'because',
        docketNumber: '123-45',
        removedFromTrial: true,
      });
      expect(trialSession.caseOrder[0].removedFromTrialDate).toBeDefined();
      expect(trialSession.caseOrder[1]).not.toHaveProperty('removedFromTrial');
      expect(trialSession.caseOrder[2]).not.toHaveProperty('removedFromTrial');
    });

    it('should not modify case calendar if docketNumber is not in caseOrder', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      trialSession.addCaseToCalendar({ docketNumber: '123-45' });
      trialSession.addCaseToCalendar({ docketNumber: '234-45' });
      trialSession.addCaseToCalendar({ docketNumber: '456-45' });
      expect(trialSession.caseOrder.length).toEqual(3);

      trialSession.removeCaseFromCalendar({
        disposition: 'because',
        docketNumber: 'abc-de',
      });

      expect(trialSession.caseOrder.length).toEqual(3);
      expect(trialSession.caseOrder[0]).not.toHaveProperty('removedFromTrial');
      expect(trialSession.caseOrder[1]).not.toHaveProperty('removedFromTrial');
      expect(trialSession.caseOrder[2]).not.toHaveProperty('removedFromTrial');
    });
  });

  it('should set the sessionStatus to closed if there all cases on the session were removed', () => {
    const trialSession = new TrialSession(
      {
        ...VALID_TRIAL_SESSION,
        sessionType: 'Hybrid',
      },
      {
        applicationContext,
      },
    );
    trialSession.addCaseToCalendar({ docketNumber: '123-45' });
    expect(trialSession.caseOrder.length).toEqual(1);

    trialSession.removeCaseFromCalendar({
      disposition: 'because',
      docketNumber: '123-45',
    });

    expect(trialSession.caseOrder.length).toEqual(1);
    expect(trialSession.caseOrder[0]).toHaveProperty('removedFromTrial');
    expect(trialSession.sessionStatus).toEqual(SESSION_STATUS_GROUPS.closed);
  });

  it('should keep the status as open if session was standalone remote even after removing all cases', () => {
    const trialSession = new TrialSession(
      {
        ...VALID_TRIAL_SESSION,
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        sessionStatus: SESSION_STATUS_GROUPS.open,
        sessionType: 'Hybrid',
      },
      {
        applicationContext,
      },
    );
    trialSession.addCaseToCalendar({ docketNumber: '123-45' });
    expect(trialSession.caseOrder.length).toEqual(1);

    trialSession.removeCaseFromCalendar({
      disposition: 'because',
      docketNumber: '123-45',
    });

    expect(trialSession.caseOrder.length).toEqual(1);
    expect(trialSession.caseOrder[0]).toHaveProperty('removedFromTrial');
    expect(trialSession.sessionStatus).toEqual(SESSION_STATUS_GROUPS.open);
  });
});
