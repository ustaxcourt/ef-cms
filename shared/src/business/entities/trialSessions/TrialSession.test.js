const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../EntityConstants');
const { TrialSession } = require('./TrialSession');

const VALID_TRIAL_SESSION = {
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionType: 'Regular',
  startDate: '2025-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};

exports.VALID_TRIAL_SESSION = VALID_TRIAL_SESSION;

describe('TrialSession entity', () => {
  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new TrialSession({}, {})).toThrow();
    });

    it('creates a valid trial session', () => {
      const trialSession = new TrialSession(VALID_TRIAL_SESSION, {
        applicationContext,
      });
      expect(trialSession.isValid()).toBeTruthy();
    });

    it('creates a valid trial session with startDate in the past', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          startDate: '2000-03-01T00:00:00.000Z',
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.isValid()).toBeTruthy();
    });

    it('creates an invalid trial session with invalid sessionType', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Something Else',
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.isValid()).toBeFalsy();
    });

    it('fails validation when caseOrder.docketNumber is not a valid docketNumber', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          caseOrder: [
            {
              docketNumber: 'abc',
            },
          ],
          sessionType: 'Something Else',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isValid()).toBeFalsy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;
      try {
        const trialSession = new TrialSession(VALID_TRIAL_SESSION, {
          applicationContext,
        });
        trialSession.validate();
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeDefined();
    });

    it('should throw an error on invalid documents', () => {
      let error;
      try {
        const trialSession = new TrialSession(
          {},
          {
            applicationContext,
          },
        );
        trialSession.validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });
  });

  describe('proceedingType', () => {
    it('should throw an error when passed an invalid proceedingType', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: {},
          postalCode: '12345',
          proceedingType: 'NOT A VALID TYPE',
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.getFormattedValidationErrors()).toMatchObject({
        proceedingType: TrialSession.VALIDATION_ERROR_MESSAGES.proceedingType,
      });
    });

    it('should be valid with a "Remote" proceedingType', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: {},
          postalCode: '12345',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isValid()).toBeTruthy();
    });

    it('should be valid with an "In Person" proceedingType', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: {},
          postalCode: '12345',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isValid()).toBeTruthy();
    });

    it('should be invalid with no proceedingType', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: {},
          postalCode: '12345',
          proceedingType: null,
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.getFormattedValidationErrors()).toMatchObject({
        proceedingType: TrialSession.VALIDATION_ERROR_MESSAGES.proceedingType,
      });
    });
  });

  describe('required fields when calendared', () => {
    describe('proceedingType In Person', () => {
      it('should be valid when isCalendared is true, proceedingType is In Person, and required address fields are missing', () => {
        const trialSession = new TrialSession(
          {
            ...VALID_TRIAL_SESSION,
            address1: undefined,
            city: undefined,
            isCalendared: true,
            postalCode: undefined,
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
            state: undefined,
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.getFormattedValidationErrors()).toEqual(null);
      });

      it('should be valid when isCalendared is true, proceedingType is In Person, and required address fields are defined', () => {
        const trialSession = new TrialSession(
          {
            ...VALID_TRIAL_SESSION,
            address1: '123 Flavor Ave',
            city: 'Flavortown',
            isCalendared: true,
            postalCode: '12345',
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
            state: 'TN',
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.getFormattedValidationErrors()).toEqual(null);
      });
    });

    describe('proceedingType Remote', () => {
      it('should be invalid when isCalendared is true and required proceeding information fields are missing', () => {
        const trialSession = new TrialSession(
          {
            ...VALID_TRIAL_SESSION,
            chambersPhoneNumber: undefined,
            isCalendared: true,
            joinPhoneNumber: undefined,
            meetingId: undefined,
            password: undefined,
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.getFormattedValidationErrors()).toMatchObject({
          chambersPhoneNumber: expect.anything(),
          joinPhoneNumber: expect.anything(),
          meetingId: expect.anything(),
          password: expect.anything(),
        });
      });

      it('should be valid when isCalendared is true and required proceeding information fields are defined', () => {
        const trialSession = new TrialSession(
          {
            ...VALID_TRIAL_SESSION,
            chambersPhoneNumber: '1111',
            isCalendared: true,
            joinPhoneNumber: '222222',
            meetingId: '33333',
            password: '44444',
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.getFormattedValidationErrors()).toEqual(null);
      });

      it('should be valid when isCalendared is true, sessionType is Special and required proceeding information fields are missing', () => {
        const trialSession = new TrialSession(
          {
            ...VALID_TRIAL_SESSION,
            chambersPhoneNumber: undefined,
            isCalendared: true,
            joinPhoneNumber: undefined,
            meetingId: undefined,
            password: undefined,
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
            sessionType: SESSION_TYPES.special,
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.getFormattedValidationErrors()).toEqual(null);
      });

      it('should be valid when isCalendared is true, sessionType is Motion/Hearing and required proceeding information fields are missing', () => {
        const trialSession = new TrialSession(
          {
            ...VALID_TRIAL_SESSION,
            chambersPhoneNumber: undefined,
            isCalendared: true,
            joinPhoneNumber: undefined,
            meetingId: undefined,
            password: undefined,
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
            sessionType: SESSION_TYPES.motionHearing,
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.getFormattedValidationErrors()).toEqual(null);
      });
    });
  });
});
