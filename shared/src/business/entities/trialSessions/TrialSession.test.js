const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../EntityConstants');
const { TrialSession } = require('./TrialSession');

describe('TrialSession entity', () => {
  const VALID_TRIAL_SESSION = {
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    sessionType: 'Regular',
    startDate: '2025-03-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

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

  describe('generateSortKeyPrefix', () => {
    it('should generate correct sort key prefix for a regular trial session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Regular',
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.generateSortKeyPrefix()).toEqual(
        'BirminghamAlabama-R',
      );
    });

    it('should generate correct sort key prefix for a small trial session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Small',
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.generateSortKeyPrefix()).toEqual(
        'BirminghamAlabama-S',
      );
    });

    it('should generate correct sort key prefix for a hybrid trial session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.generateSortKeyPrefix()).toEqual(
        'BirminghamAlabama-H',
      );
    });
  });

  describe('setAsCalendared', () => {
    it('should set a valid trial session entity as calendared upon request', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      trialSession.setAsCalendared();
      expect(trialSession.isCalendared).toEqual(true);
    });
  });

  describe('addCaseToCalendar', () => {
    it('should add case to calendar of valid trial session when provided a raw case entity with a docketNumber', () => {
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

      expect(trialSession.caseOrder[0]).toEqual({ docketNumber: '123-45' });
    });

    it('should add case to calendar once', () => {
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
      trialSession.addCaseToCalendar({ docketNumber: '123-45' });

      expect(trialSession.caseOrder[0]).toEqual({ docketNumber: '123-45' });
      expect(trialSession.caseOrder[1]).toBeUndefined();
    });
  });

  describe('manuallyAddCaseToCalendar', () => {
    const dateRegex = /^\d*-\d*-\d*T\d*:\d*:\d*.\d*Z$/g;

    it('should add case to calendar of valid trial session when provided a raw case entity with a docketNumber', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      const mockCaseEntity = { docketNumber: '123-45' };
      trialSession.manuallyAddCaseToCalendar({ caseEntity: mockCaseEntity });

      expect(trialSession.caseOrder[0]).toEqual({
        addedToSessionAt: expect.stringMatching(dateRegex),
        docketNumber: '123-45',
        isManuallyAdded: true,
      });
    });

    it('should add case to calendar and include calendarNotes when they are provided', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      const mockCaseEntity = { docketNumber: '123-45' };
      trialSession.manuallyAddCaseToCalendar({
        calendarNotes: 'Test',
        caseEntity: mockCaseEntity,
      });

      expect(trialSession.caseOrder[0]).toEqual({
        addedToSessionAt: expect.stringMatching(dateRegex),
        calendarNotes: 'Test',
        docketNumber: '123-45',
        isManuallyAdded: true,
      });
    });
  });

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

  describe('isCaseAlreadyCalendared', () => {
    it('should return true when a case is already part of the trial session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          caseOrder: [{ docketNumber: '123-45' }],
        },
        {
          applicationContext,
        },
      );
      expect(
        trialSession.isCaseAlreadyCalendared({ docketNumber: '123-45' }),
      ).toBeTruthy();
    });

    it('should return false when a case is not already part of the trial session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          caseOrder: [{ docketNumber: 'abc-de' }],
        },
        {
          applicationContext,
        },
      );
      expect(
        trialSession.isCaseAlreadyCalendared({ docketNumber: '123-45' }),
      ).toBeFalsy();
    });

    it('should return false even for cases that have been manually removed', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          caseOrder: [{ docketNumber: 'abc-de', removedFromTrial: true }],
        },
        {
          applicationContext,
        },
      );
      expect(
        trialSession.isCaseAlreadyCalendared({ docketNumber: '123-45' }),
      ).toBeFalsy();
    });
  });

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

  describe('canSetAsCalendared', () => {
    it('should be able to set a trial session as calendared if all properties are not empty for an in-person session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: { name: 'Judge Colvin' },
          postalCode: '12345',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.canSetAsCalendared()).toBeTruthy();
    });

    it('should NOT be able to set a trial session as calendared if one or more properties are empty for an in-person session', () => {
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

      expect(trialSession.canSetAsCalendared()).toBeFalsy();
    });

    it('should be able to set a trial session as calendared if all properties are not empty for a remote session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          chambersPhoneNumber: '111111',
          joinPhoneNumber: '222222',
          judge: { name: 'Judge Colvin' },
          meetingId: '333333',
          password: '4444444',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.canSetAsCalendared()).toBeTruthy();
    });

    it('should NOT be able to set a trial session as calendared if one or more properties are empty for a remote session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          judge: {},
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.canSetAsCalendared()).toBeFalsy();
    });
  });

  describe('getEmptyFields', () => {
    it('should return all missing fields as a list for an in-person session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        },
        {
          applicationContext,
        },
      );

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([
        'address1',
        'city',
        'state',
        'postalCode',
        'judge',
      ]);
    });

    it('should return an empty list when all required fields as set for an in-person session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: { name: 'Judge Colvin' },
          postalCode: '12345',
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([]);
    });

    it('should return all missing fields as a list for a remote session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
        {
          applicationContext,
        },
      );

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([
        'chambersPhoneNumber',
        'joinPhoneNumber',
        'meetingId',
        'password',
        'judge',
      ]);
    });

    it('should return an empty list when all required fields as set for a remote session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          chambersPhoneNumber: '1111111',
          joinPhoneNumber: '22222222',
          judge: {
            name: 'Mary Kate',
            userId: '711cee39-5747-4f6c-8f0d-89177bf2da36',
          },
          meetingId: '12345678',
          password: '0987654321',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
        {
          applicationContext,
        },
      );

      const result = trialSession.getEmptyFields();

      expect(result).toMatchObject([]);
    });
  });

  describe('setNoticesIssued', () => {
    it('Should set the noticeIssuedDate on the trial session', async () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: {},
          postalCode: '12345',
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.noticeIssuedDate).toBeFalsy();

      trialSession.setNoticesIssued();

      expect(trialSession.noticeIssuedDate).toBeTruthy();
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
