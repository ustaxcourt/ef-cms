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
  describe('getStatus', () => {
    it('should return open if the trial session is calendared', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          isCalendared: true,
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.getStatus()).toEqual(SESSION_STATUS_GROUPS.open);
    });

    it('should return new if the trial session is not calendared', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          isCalendared: false,
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.getStatus()).toEqual(SESSION_STATUS_GROUPS.new);
    });

    it('should return closed if the trial session was manually closed', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          isCalendared: false,
          isClosed: true,
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.getStatus()).toEqual(SESSION_STATUS_GROUPS.closed);
    });

    it('should return closed if the trial session was calendared and also manually closed', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          isCalendared: true,
          isClosed: true,
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.getStatus()).toEqual(SESSION_STATUS_GROUPS.closed);
    });

    it('should return closed if the trial session only has inactive cases', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          caseOrder: [
            {
              docketNumber: '123-45',
              removedFromTrial: true,
            },
          ],
          isCalendared: true,
          isClosed: false,
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.getStatus()).toEqual(SESSION_STATUS_GROUPS.closed);
    });

    it('should not be closed if the trial session is a stand alone remote session but also has no active cases', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          caseOrder: [
            {
              docketNumber: '123-45',
              removedFromTrial: true,
            },
          ],
          isCalendared: true,
          isClosed: false,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.getStatus()).not.toEqual(
        SESSION_STATUS_GROUPS.closed,
      );
    });
  });
});
