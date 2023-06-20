import { TrialSessionWorkingCopy } from './TrialSessionWorkingCopy';

const VALID_TRIAL_SESSION_WORKING_COPY = {
  trialSessionId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
  userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
};

describe('TrialSessionWorkingCopy entity', () => {
  describe('isValid', () => {
    it('creates a valid trial session working copy with only required values', () => {
      const workingCopy = new TrialSessionWorkingCopy(
        VALID_TRIAL_SESSION_WORKING_COPY,
      );
      expect(workingCopy.isValid()).toBeTruthy();
    });

    it('creates a valid trial session working copy with all values', () => {
      const workingCopy = new TrialSessionWorkingCopy({
        ...VALID_TRIAL_SESSION_WORKING_COPY,
        caseMetadata: {
          '101-19': {
            trialStatus: 'recall',
          },
        },
        sessionNotes: 'These are notes about a session',
        sort: 'practitioner',
        sortOrder: 'desc',
      });
      expect(workingCopy.isValid()).toBeTruthy();
    });

    it('creates an invalid trial session with invalid userId', () => {
      const workingCopy = new TrialSessionWorkingCopy({
        ...VALID_TRIAL_SESSION_WORKING_COPY,
        userId: undefined,
      });
      expect(workingCopy.isValid()).toBeFalsy();
    });

    it('creates an invalid trial session working copy with invalid trialStatus that is not a string', () => {
      const workingCopy = new TrialSessionWorkingCopy({
        ...VALID_TRIAL_SESSION_WORKING_COPY,
        caseMetadata: {
          '101-19': {
            trialStatus: 123,
          },
        },
        filters: {
          basisReached: true,
          showAll: true,
        },
      });
      expect(workingCopy.isValid()).toBeFalsy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;
      try {
        const workingCopy = new TrialSessionWorkingCopy(
          VALID_TRIAL_SESSION_WORKING_COPY,
        );
        workingCopy.validate();
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeDefined();
    });

    it('should throw an error if invalid', () => {
      let error;
      try {
        const workingCopy = new TrialSessionWorkingCopy({});
        workingCopy.validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });
    it('should allow empty string for caseMetadata trialStatus field', () => {
      let error;
      try {
        const workingCopy = new TrialSessionWorkingCopy({
          ...VALID_TRIAL_SESSION_WORKING_COPY,
          caseMetadata: {
            '111-11': { trialStatus: '' },
          },
        });
        workingCopy.validate();
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeDefined();
    });
  });
});
