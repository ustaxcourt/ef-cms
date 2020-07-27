const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { TrialSession } = require('./TrialSession');

describe('TrialSession entity', () => {
  const VALID_TRIAL_SESSION = {
    maxCases: 100,
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
    it('should add case to calendar of valid trial session when provided a raw case entity with a caseId', () => {
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
  });

  describe('manuallyAddCaseToCalendar', () => {
    it('should add case to calendar of valid trial session when provided a raw case entity with a caseId', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      trialSession.manuallyAddCaseToCalendar({ docketNumber: '123-45' });

      expect(trialSession.caseOrder[0]).toEqual({
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

    it('should not modify case calendar if caseId is not in caseOrder', () => {
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
    it('should be able to set a trial session as calendared if all properties are not empty', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: { name: 'Judge Armen' },
          postalCode: '12345',
          state: 'TN',
        },
        {
          applicationContext,
        },
      );

      expect(trialSession.canSetAsCalendared()).toBeTruthy();
    });

    it('should NOT be able to set a trial session as calendared if one or more properties are not empty', () => {
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

      expect(trialSession.canSetAsCalendared()).toBeFalsy();
    });
  });

  describe('getEmptyFields', () => {
    it('should return all missing fields as a list', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
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

    it('should return an empty list when all required fields as set', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          address1: '123 Flavor Ave',
          city: 'Flavortown',
          judge: { name: 'Judge Armen' },
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
});
