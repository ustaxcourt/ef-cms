/* eslint-disable max-lines */
import { FORMATS, prepareDateFromString } from '../../utilities/DateHandler';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../EntityConstants';
import { TrialSession } from './TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  it('should throw an error when applicationContext is not passed in', () => {
    expect(() => new TrialSession({}, {} as any)).toThrow();
  });

  describe('isValid', () => {
    it('should be true when a valid trial session is provided', () => {
      const trialSession = new TrialSession(MOCK_TRIAL_REGULAR, {
        applicationContext,
      });

      expect(trialSession.isValid()).toBe(true);
    });

    it('should be true when a valid trial session with startDate in the past is provided', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          startDate: '2000-03-01T00:00:00.000Z',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isValid()).toBe(true);
    });

    it('should be false when an invalid sessionType is provided', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          sessionType: 'Something Else',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isValid()).toBe(false);
    });

    it('should be false when an invalid docketNumber in caseOrder is provided', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
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

      expect(trialSession.isValid()).toBe(false);
    });

    describe('isCalendared === true', () => {
      describe('proceedingType === "In Person"', () => {
        it('should be valid when isCalendared is true, proceedingType is "In Person", and optional address fields are missing', () => {
          const trialSession = new TrialSession(
            {
              ...MOCK_TRIAL_REGULAR,
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

          expect(trialSession.isValid()).toBe(true);
          expect(trialSession.getFormattedValidationErrors()).toEqual(null);
        });

        it('should be valid when isCalendared is true, proceedingType is In Person, and required address fields are defined', () => {
          const trialSession = new TrialSession(
            {
              ...MOCK_TRIAL_REGULAR,
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

          expect(trialSession.isValid()).toBe(true);
          expect(trialSession.getFormattedValidationErrors()).toEqual(null);
        });
      });

      describe('proceedingType === "Remote"', () => {
        describe(`sessionScope === ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
          it('should be invalid when isCalendared is true and required proceeding information fields are missing', () => {
            const trialSession = new TrialSession(
              {
                ...MOCK_TRIAL_REGULAR,
                chambersPhoneNumber: undefined,
                isCalendared: true,
                joinPhoneNumber: undefined,
                meetingId: undefined,
                password: undefined,
                proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
                sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
              },
              {
                applicationContext,
              },
            );

            expect(trialSession.isValid()).toBe(false);
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
                ...MOCK_TRIAL_REGULAR,
                chambersPhoneNumber: '1111',
                isCalendared: true,
                joinPhoneNumber: '222222',
                meetingId: '33333',
                password: '44444',
                proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
                sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
              },
              {
                applicationContext,
              },
            );

            expect(trialSession.isValid()).toBe(true);
            expect(trialSession.getFormattedValidationErrors()).toEqual(null);
          });

          it('should be valid when isCalendared is true, sessionType is "Special" and optional proceeding information fields are missing', () => {
            const trialSession = new TrialSession(
              {
                ...MOCK_TRIAL_REGULAR,
                chambersPhoneNumber: undefined,
                isCalendared: true,
                joinPhoneNumber: undefined,
                meetingId: undefined,
                password: undefined,
                proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
                sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
                sessionType: SESSION_TYPES.special,
              },
              {
                applicationContext,
              },
            );

            expect(trialSession.isValid()).toBe(true);
            expect(trialSession.getFormattedValidationErrors()).toEqual(null);
          });

          it('should be valid when isCalendared is true, sessionType is Motion/Hearing and optional proceeding information fields are missing', () => {
            const trialSession = new TrialSession(
              {
                ...MOCK_TRIAL_REGULAR,
                chambersPhoneNumber: undefined,
                isCalendared: true,
                joinPhoneNumber: undefined,
                meetingId: undefined,
                password: undefined,
                proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
                sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
                sessionType: SESSION_TYPES.motionHearing,
              },
              {
                applicationContext,
              },
            );

            expect(trialSession.isValid()).toBe(true);
            expect(trialSession.getFormattedValidationErrors()).toEqual(null);
          });
        });

        describe(`sessionScope === ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
          it('should be valid when isCalendared is true and optional proceeding information fields are missing', () => {
            const trialSession = new TrialSession(
              {
                ...MOCK_TRIAL_REGULAR,
                chambersPhoneNumber: undefined,
                isCalendared: true,
                joinPhoneNumber: undefined,
                meetingId: undefined,
                password: undefined,
                proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
                sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
              },
              {
                applicationContext,
              },
            );

            expect(trialSession.isValid()).toBe(true);
            expect(trialSession.getFormattedValidationErrors()).toEqual(null);
          });
        });
      });
    });

    describe('proceedingType', () => {
      it('should be invalid when proceedingType is invalid', () => {
        const trialSession = new TrialSession(
          {
            ...MOCK_TRIAL_REGULAR,
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

        expect(trialSession.isValid()).toBe(false);
        expect(trialSession.getFormattedValidationErrors()).toMatchObject({
          proceedingType: 'Enter a valid proceeding type',
        });
      });

      it('should be valid when proceedingType is "Remote"', () => {
        const trialSession = new TrialSession(
          {
            ...MOCK_TRIAL_REGULAR,
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

        expect(trialSession.isValid()).toBe(true);
      });

      it('should be valid when proceedingType is "In Person"', () => {
        const trialSession = new TrialSession(
          {
            ...MOCK_TRIAL_REGULAR,
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

        expect(trialSession.isValid()).toBe(true);
      });

      it('should be invalid when proceedingType is undefined', () => {
        const trialSession = new TrialSession(
          {
            ...MOCK_TRIAL_REGULAR,
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

        expect(trialSession.isValid()).toBe(false);
        expect(trialSession.getFormattedValidationErrors()).toMatchObject({
          proceedingType: 'Enter a valid proceeding type',
        });
      });
    });

    describe('sessionScope', () => {
      it(`should make maxCases optional when sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
        const trialSession = new TrialSession(
          {
            ...MOCK_TRIAL_REGULAR,
            maxCases: undefined,
            sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.isValid()).toBe(true);
      });

      it(`should require maxCases when sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
        const trialSession = new TrialSession(
          {
            ...MOCK_TRIAL_REGULAR,
            maxCases: undefined,
            sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.isValid()).toBe(false);
        expect(trialSession.getFormattedValidationErrors()).toMatchObject({
          maxCases: 'Enter a valid number of maximum cases',
        });
      });

      it(`should make trialLocation optional when sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
        const trialSession = new TrialSession(
          {
            ...MOCK_TRIAL_REGULAR,
            sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
            trialLocation: undefined,
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.isValid()).toBe(true);
      });

      it(`should require trialLocation when sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
        const trialSession = new TrialSession(
          {
            ...MOCK_TRIAL_REGULAR,
            sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
            trialLocation: undefined,
          },
          {
            applicationContext,
          },
        );

        expect(trialSession.isValid()).toBe(false);
        expect(trialSession.getFormattedValidationErrors()).toMatchObject({
          trialLocation: 'Select a trial session location',
        });
      });
    });
  });

  describe('validate', () => {
    it('should do nothing when the trialSession is valid', () => {
      const trialSession = new TrialSession(MOCK_TRIAL_REGULAR, {
        applicationContext,
      });

      expect(() => trialSession.validate()).not.toThrow();
    });

    it('should throw an error when the trialSession is invalid', () => {
      const trialSession = new TrialSession(
        {},
        {
          applicationContext,
        },
      );

      expect(() => trialSession.validate()).toThrow();
    });
  });

  describe('isStandaloneRemote', () => {
    it(`should return false when the sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isStandaloneRemote()).toEqual(false);
    });

    it(`should return true when the sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isStandaloneRemote()).toEqual(true);
    });
  });

  describe('proceedingType', () => {
    it(`should be ${TRIAL_SESSION_PROCEEDING_TYPES.remote} when sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: {},
          postalCode: '12345',
          proceedingType: undefined,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.proceedingType).toBe(
        TRIAL_SESSION_PROCEEDING_TYPES.remote,
      );
    });
  });

  describe('sessionScope', () => {
    it(`should default to ${TRIAL_SESSION_SCOPE_TYPES.locationBased} when sessionScope is undefined`, () => {
      const trialSession = new TrialSession(
        { ...MOCK_TRIAL_REGULAR, sessionScope: undefined },
        {
          applicationContext,
        },
      );

      expect(trialSession.sessionScope).toEqual(
        TRIAL_SESSION_SCOPE_TYPES.locationBased,
      );
    });
  });

  describe('startTime', () => {
    it(`should default to "10:00" when sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased} and startTime is not provided`, () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
          startTime: undefined,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.startTime).toEqual('10:00');
    });

    it(`should be set to the provided value when sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const mockStartTime = '12:00';

      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
          startTime: mockStartTime,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.startTime).toEqual(mockStartTime);
    });

    it(`should be set to "13:00" (1:00PM) when sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const mockStartTime = '12:00';

      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
          startTime: mockStartTime,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.startTime).toEqual('13:00');
    });
  });

  describe('trialLocation', () => {
    it(`should be set to ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote} when sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
          trialLocation: undefined,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.trialLocation).toBe(
        TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      );
    });

    it(`should be set to the provided trialLocation when sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const mockTrialLocation = 'Asgard';

      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
          trialLocation: mockTrialLocation,
        },
        // eslint-disable-next-line max-lines
        {
          applicationContext,
        },
      );

      expect(trialSession.trialLocation).toBe(mockTrialLocation);
    });
  });

  describe('estimatedEndDate', () => {
    it('should error when estimatedEndDate is chronologically before the startDate', () => {
      const incorrectEstimatedEndDate = prepareDateFromString(
        MOCK_TRIAL_REGULAR.startDate,
        FORMATS.MMDDYY,
      ).minus({
        ['days']: 34,
      });

      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          estimatedEndDate: incorrectEstimatedEndDate,
        },
        {
          applicationContext,
        },
      );

      expect(() => trialSession.validate()).toThrow();
      expect(trialSession.getFormattedValidationErrors()).toMatchObject({
        estimatedEndDate: 'Enter a valid estimated end date',
      });
    });

    it('should be valid when estimatedEndDate is greater than or equal to the startDate', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          estimatedEndDate: MOCK_TRIAL_REGULAR.startDate,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.isValid()).toBe(true);
    });
  });

  describe('dismissedAlertForNOTT', () => {
    it('should have a default value of false', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.dismissedAlertForNOTT).toBe(false);
    });
  });

  describe('paperServicePdfs', () => {
    it('should default to an empty array when the trial session does not already have any paper service pdfs', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          paperServicePdfs: undefined,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.paperServicePdfs).toEqual([]);
    });

    it('should require a fileId and title on each entry to be valid', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_REGULAR,
          paperServicePdfs: [{}],
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.getFormattedValidationErrors()).toEqual({
        fileId: '"paperServicePdfs[0].fileId" is required',
        title: '"paperServicePdfs[0].title" is required',
      });
    });
  });
});
