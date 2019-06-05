const assert = require('assert');
const { TrialSession } = require('./TrialSession');

const VALID_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  trialLocation: 'Birmingham, AL',
};

describe('TrialSession entity', () => {
  describe('isValid', () => {
    it('creates a valid trial session', () => {
      const trialSession = new TrialSession(VALID_TRIAL_SESSION);
      assert.ok(trialSession.isValid());
    });

    it('creates an invalid trial session with startDate in the past', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        startDate: '2000-03-01T00:00:00.000Z',
      });
      assert.ok(!trialSession.isValid());
    });

    it('creates an invalid trial session with invalid sessionType', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        sessionType: 'Something Else',
      });
      assert.ok(!trialSession.isValid());
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error = null;
      try {
        const trialSession = new TrialSession(VALID_TRIAL_SESSION);
        trialSession.validate();
      } catch (err) {
        error = err;
      }
      assert.ok(error === null);
    });

    it('should throw an error on invalid documents', () => {
      let error = null;
      try {
        const trialSession = new TrialSession({});
        trialSession.validate();
      } catch (err) {
        error = err;
      }
      assert.ok(error !== null);
    });
  });
});
