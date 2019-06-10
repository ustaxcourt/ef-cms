const { TrialSession } = require('./TrialSession');

const VALID_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, AL',
};

describe('TrialSession entity', () => {
  describe('isValid', () => {
    it('creates a valid trial session', () => {
      const trialSession = new TrialSession(VALID_TRIAL_SESSION);
      expect(trialSession.isValid()).toBeTruthy();
    });

    it('creates an invalid trial session with startDate in the past', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        startDate: '2000-03-01T00:00:00.000Z',
      });
      expect(trialSession.isValid()).toBeFalsy();
    });

    it('creates an invalid trial session with invalid sessionType', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        sessionType: 'Something Else',
      });
      expect(trialSession.isValid()).toBeFalsy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;
      try {
        const trialSession = new TrialSession(VALID_TRIAL_SESSION);
        trialSession.validate();
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeDefined();
    });

    it('should throw an error on invalid documents', () => {
      let error;
      try {
        const trialSession = new TrialSession({});
        trialSession.validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });
  });
});
