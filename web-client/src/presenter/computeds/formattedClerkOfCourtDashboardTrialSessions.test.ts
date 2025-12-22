import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formattedClerkOfCourtDashboardTrialSessions as formattedClerkOfCourtDashboardTrialSessionsComputed } from './formattedClerkOfCourtDashboardTrialSessions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import {
  createDateAtStartOfWeekEST,
  createISODateString,
  FORMATS,
  prepareDateFromString,
} from '@shared/business/utilities/DateHandler';

const formattedClerkOfCourtDashboardTrialSessions = withAppContextDecorator(
  formattedClerkOfCourtDashboardTrialSessionsComputed,
  applicationContext,
);

describe('formattedClerkOfCourtDashboardTrialSessions', () => {
  const getCurrentWeekStart = () => {
    const today = createISODateString();
    return createDateAtStartOfWeekEST(today, FORMATS.ISO);
  };

  const getCurrentWeekEnd = () => {
    const weekStart = getCurrentWeekStart();
    const weekStartDateTime = prepareDateFromString(weekStart);
    return weekStartDateTime.plus({ days: 6 }).endOf('day').toISO()!;
  };

  const getNextWeekStart = () => {
    const weekStart = getCurrentWeekStart();
    const weekStartDateTime = prepareDateFromString(weekStart);
    return weekStartDateTime.plus({ days: 7 }).toISO()!;
  };

  const getNextWeekEnd = () => {
    const nextWeekStart = getNextWeekStart();
    const nextWeekStartDateTime = prepareDateFromString(nextWeekStart);
    return nextWeekStartDateTime.plus({ days: 6 }).endOf('day').toISO()!;
  };

  const createTrialSession = (
    overrides: Partial<TrialSessionInfoDTO> = {},
  ): TrialSessionInfoDTO => ({
    isCalendared: true,
    judge: { name: 'Test Judge', userId: 'test-judge-id' },
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    sessionScope: 'Location-based',
    sessionStatus: SESSION_STATUS_TYPES.open,
    sessionType: SESSION_TYPES.regular,
    startDate: getCurrentWeekStart(),
    term: 'Fall',
    termYear: '2024',
    trialLocation: 'Hartford, Connecticut',
    trialSessionId: 'test-session-id',
    ...overrides,
  });

  describe('week filtering', () => {
    it('filters trial sessions by current week and next week', () => {
      const currentWeekStart = getCurrentWeekStart();
      const nextWeekStart = getNextWeekStart();

      const TRIAL_SESSIONS = [
        createTrialSession({
          trialSessionId: '1',
          startDate: currentWeekStart,
          trialLocation: 'Hartford, Connecticut',
          judge: { name: 'Judge 1', userId: '1' },
          trialClerk: { name: 'Clerk 1', userId: 'clerk-1' },
        }),
        createTrialSession({
          trialSessionId: '2',
          startDate: nextWeekStart,
          trialLocation: 'Knoxville, TN',
          sessionType: SESSION_TYPES.small,
          judge: { name: 'Judge 2', userId: '2' },
          trialClerk: { name: 'Clerk 2', userId: 'clerk-2' },
        }),
        createTrialSession({
          trialSessionId: '3',
          startDate: createISODateString(),
          trialLocation: 'Jacksonville, FL',
          judge: { name: 'Judge 3', userId: '3' },
        }),
      ];

      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: TRIAL_SESSIONS,
        },
      });

      expect(result.formattedCurrentWeekSessions.length).toBe(2);
      expect(result.formattedNextWeekSessions.length).toBe(1);
      expect(
        result.formattedCurrentWeekSessions.some(s => s.trialSessionId === '1'),
      ).toBe(true);
      expect(
        result.formattedCurrentWeekSessions.some(s => s.trialSessionId === '3'),
      ).toBe(true);
      expect(
        result.formattedNextWeekSessions.some(s => s.trialSessionId === '2'),
      ).toBe(true);
    });

    it('includes sessions at week boundaries', () => {
      const currentWeekStart = getCurrentWeekStart();
      const currentWeekEnd = getCurrentWeekEnd();
      const nextWeekStart = getNextWeekStart();
      const nextWeekEnd = getNextWeekEnd();

      const TRIAL_SESSIONS = [
        createTrialSession({
          trialSessionId: 'start-boundary',
          startDate: currentWeekStart,
        }),
        createTrialSession({
          trialSessionId: 'end-boundary',
          startDate: currentWeekEnd,
        }),
        createTrialSession({
          trialSessionId: 'next-start-boundary',
          startDate: nextWeekStart,
        }),
        createTrialSession({
          trialSessionId: 'next-end-boundary',
          startDate: nextWeekEnd,
        }),
      ];

      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: TRIAL_SESSIONS,
        },
      });

      expect(result.formattedCurrentWeekSessions.length).toBe(2);
      expect(result.formattedNextWeekSessions.length).toBe(2);
      expect(
        result.formattedCurrentWeekSessions.some(
          s => s.trialSessionId === 'start-boundary',
        ),
      ).toBe(true);
      expect(
        result.formattedCurrentWeekSessions.some(
          s => s.trialSessionId === 'end-boundary',
        ),
      ).toBe(true);
      expect(
        result.formattedNextWeekSessions.some(
          s => s.trialSessionId === 'next-start-boundary',
        ),
      ).toBe(true);
      expect(
        result.formattedNextWeekSessions.some(
          s => s.trialSessionId === 'next-end-boundary',
        ),
      ).toBe(true);
    });

    it('excludes sessions outside current and next week', () => {
      const currentWeekStart = getCurrentWeekStart();
      const pastDate = prepareDateFromString(currentWeekStart)
        .minus({ days: 7 })
        .toISO()!;
      const futureDate = prepareDateFromString(getNextWeekEnd())
        .plus({ days: 1 })
        .toISO()!;

      const TRIAL_SESSIONS = [
        createTrialSession({
          trialSessionId: 'past',
          startDate: pastDate,
        }),
        createTrialSession({
          trialSessionId: 'future',
          startDate: futureDate,
        }),
        createTrialSession({
          trialSessionId: 'current',
          startDate: currentWeekStart,
        }),
      ];

      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: TRIAL_SESSIONS,
        },
      });

      expect(result.formattedCurrentWeekSessions.length).toBe(1);
      expect(result.formattedNextWeekSessions.length).toBe(0);
      expect(
        result.formattedCurrentWeekSessions.some(
          s => s.trialSessionId === 'current',
        ),
      ).toBe(true);
    });
  });

  describe('session status filtering', () => {
    it('returns only open trial sessions', () => {
      const TRIAL_SESSIONS = [
        createTrialSession({
          trialSessionId: '1',
          trialLocation: 'Hartford, Connecticut',
          judge: { name: 'Judge 1', userId: '1' },
        }),
        createTrialSession({
          trialSessionId: '2',
          sessionStatus: SESSION_STATUS_TYPES.closed,
          trialLocation: 'Knoxville, TN',
          judge: { name: 'Judge 2', userId: '2' },
        }),
        createTrialSession({
          trialSessionId: '3',
          sessionStatus: SESSION_STATUS_TYPES.new,
          trialLocation: 'Jacksonville, FL',
          judge: { name: 'Judge 3', userId: '3' },
        }),
      ];

      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: TRIAL_SESSIONS,
        },
      });

      const allSessions = [
        ...result.formattedCurrentWeekSessions,
        ...result.formattedNextWeekSessions,
      ];
      expect(allSessions.length).toBe(1);
      expect(allSessions[0].trialSessionId).toBe('1');
    });
  });

  describe('field formatting', () => {
    it('formats all required fields correctly', () => {
      const currentWeekStart = getCurrentWeekStart();
      const estimatedEndDate = prepareDateFromString(currentWeekStart)
        .plus({ days: 3 })
        .toISO()!;

      const TRIAL_SESSIONS = [
        createTrialSession({
          trialSessionId: '1',
          startDate: currentWeekStart,
          estimatedEndDate,
          trialLocation: 'Hartford, Connecticut',
          judge: { name: 'Judge 1', userId: '1' },
          trialClerk: { name: 'Clerk 1', userId: 'clerk-1' },
        }),
      ];

      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: TRIAL_SESSIONS,
        },
      });

      const session =
        result.formattedCurrentWeekSessions[0] ||
        result.formattedNextWeekSessions[0];

      expect(session).toMatchObject({
        trialSessionId: '1',
        formattedStartDate: expect.any(String),
        formattedEstimatedEndDate: expect.any(String),
        trialLocation: 'Hartford, Connecticut',
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionType: SESSION_TYPES.regular,
        judge: { name: 'Judge 1', userId: '1' },
        trialClerk: { name: 'Clerk 1', userId: 'clerk-1' },
      });
      expect(session.formattedStartDate).toMatch(/^\d{2}\/\d{2}\/\d{2}$/);
      expect(session.formattedEstimatedEndDate).toMatch(
        /^\d{2}\/\d{2}\/\d{2}$/,
      );
    });

    it('handles sessions without trialClerk', () => {
      const TRIAL_SESSIONS = [
        createTrialSession({
          trialSessionId: '1',
          trialLocation: 'Hartford, Connecticut',
          judge: { name: 'Judge 1', userId: '1' },
        }),
      ];

      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: TRIAL_SESSIONS,
        },
      });

      const session =
        result.formattedCurrentWeekSessions[0] ||
        result.formattedNextWeekSessions[0];

      expect(session.trialClerk).toBeUndefined();
      expect(session.judge).toEqual({ name: 'Judge 1', userId: '1' });
    });

    it('handles sessions without estimatedEndDate', () => {
      const TRIAL_SESSIONS = [
        createTrialSession({
          trialSessionId: '1',
          trialLocation: 'Hartford, Connecticut',
          judge: { name: 'Judge 1', userId: '1' },
        }),
      ];

      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: TRIAL_SESSIONS,
        },
      });

      const session =
        result.formattedCurrentWeekSessions[0] ||
        result.formattedNextWeekSessions[0];

      expect(session.formattedEstimatedEndDate).toBe('');
    });

    it('handles sessions with missing optional fields', () => {
      const TRIAL_SESSIONS = [
        createTrialSession({
          trialSessionId: '1',
          judge: undefined,
          trialLocation: undefined,
          proceedingType: undefined as any,
          sessionType: undefined as any,
        }),
      ];

      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: TRIAL_SESSIONS,
        },
      });

      const session =
        result.formattedCurrentWeekSessions[0] ||
        result.formattedNextWeekSessions[0];

      expect(session.judge).toEqual({ name: 'Unassigned', userId: '' });
      expect(session.trialLocation).toBe('');
      expect(session.proceedingType).toBe('');
      expect(session.sessionType).toBe('');
    });
  });

  describe('sorting', () => {
    it('sorts sessions by start date', () => {
      const currentWeekStart = getCurrentWeekStart();
      const currentWeekStartDateTime = prepareDateFromString(currentWeekStart);

      const TRIAL_SESSIONS = [
        createTrialSession({
          trialSessionId: '3',
          startDate: currentWeekStartDateTime.plus({ days: 2 }).toISO()!,
          trialLocation: 'Hartford, Connecticut',
          judge: { name: 'Judge 3', userId: '3' },
        }),
        createTrialSession({
          trialSessionId: '1',
          startDate: currentWeekStart,
          trialLocation: 'Knoxville, TN',
          judge: { name: 'Judge 1', userId: '1' },
        }),
        createTrialSession({
          trialSessionId: '2',
          startDate: currentWeekStartDateTime.plus({ days: 1 }).toISO()!,
          trialLocation: 'Jacksonville, FL',
          judge: { name: 'Judge 2', userId: '2' },
        }),
      ];

      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: TRIAL_SESSIONS,
        },
      });

      const sessions = result.formattedCurrentWeekSessions;
      expect(sessions.length).toBeGreaterThanOrEqual(3);
      expect(sessions[0].trialSessionId).toBe('1');
      expect(sessions[1].trialSessionId).toBe('2');
      expect(sessions[2].trialSessionId).toBe('3');
    });
  });

  describe('edge cases', () => {
    it('returns empty arrays when no sessions match', () => {
      const pastDate = prepareDateFromString(getCurrentWeekStart())
        .minus({ days: 14 })
        .toISO()!;

      const TRIAL_SESSIONS = [
        createTrialSession({
          trialSessionId: '1',
          startDate: pastDate,
          trialLocation: 'Hartford, Connecticut',
          judge: { name: 'Judge 1', userId: '1' },
        }),
      ];

      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: TRIAL_SESSIONS,
        },
      });

      expect(result.formattedCurrentWeekSessions).toEqual([]);
      expect(result.formattedNextWeekSessions).toEqual([]);
    });

    it('handles empty trial sessions array', () => {
      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: [],
        },
      });

      expect(result.formattedCurrentWeekSessions).toEqual([]);
      expect(result.formattedNextWeekSessions).toEqual([]);
    });

    it('handles undefined trial sessions', () => {
      const result = runCompute(formattedClerkOfCourtDashboardTrialSessions, {
        state: {
          trialSessions: undefined,
        },
      });

      expect(result.formattedCurrentWeekSessions).toEqual([]);
      expect(result.formattedNextWeekSessions).toEqual([]);
    });
  });
});
