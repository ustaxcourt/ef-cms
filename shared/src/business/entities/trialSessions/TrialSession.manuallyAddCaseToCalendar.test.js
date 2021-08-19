const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { TrialSession } = require('./TrialSession');
const { VALID_TRIAL_SESSION } = require('./TrialSession.test');

describe('TrialSession entity', () => {
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
});
