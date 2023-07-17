import { Case } from '../cases/Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSession } from './TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('manuallyAddCaseToCalendar', () => {
    const mockCaseEntity = new Case(MOCK_CASE, { applicationContext });
    const dateRegex = /^\d*-\d*-\d*T\d*:\d*:\d*.\d*Z$/g;

    let trialSession: TrialSession;

    beforeEach(() => {
      trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_INPERSON,
          caseOrder: [],
        },
        {
          applicationContext,
        },
      );
    });

    it('should add case to calendar of valid trial session when provided a raw case entity with a docketNumber', () => {
      trialSession.manuallyAddCaseToCalendar({
        calendarNotes: undefined,
        caseEntity: mockCaseEntity,
      });

      expect(trialSession.caseOrder![0]).toEqual({
        addedToSessionAt: expect.stringMatching(dateRegex),
        docketNumber: mockCaseEntity.docketNumber,
        isManuallyAdded: true,
      });
    });

    it('should add case to calendar and include calendarNotes when they are provided', () => {
      const mockCalendarNotes = 'Test';

      trialSession.manuallyAddCaseToCalendar({
        calendarNotes: mockCalendarNotes,
        caseEntity: mockCaseEntity,
      });

      expect(trialSession.caseOrder![0]).toEqual({
        addedToSessionAt: expect.stringMatching(dateRegex),
        calendarNotes: mockCalendarNotes,
        docketNumber: mockCaseEntity.docketNumber,
        isManuallyAdded: true,
      });
    });
  });
});
