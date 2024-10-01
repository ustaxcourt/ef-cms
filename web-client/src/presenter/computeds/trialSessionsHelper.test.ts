/* eslint-disable max-lines */
import {
  FORMATS,
  calculateISODate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { cloneDeep } from 'lodash';
import {
  docketClerk1User,
  judgeColvin,
  judgeUser,
  legacyJudgeUser,
} from '@shared/test/mockUsers';
import { getUserPermissions } from '@shared/authorization/getUserPermissions';
import { initialTrialSessionPageState } from '../state/trialSessionsPageState';
import {
  isTrialSessionRow,
  isTrialSessionWeek,
  trialSessionsHelper as trialSessionsHelperComputed,
} from './trialSessionsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const trialSessionsHelper = withAppContextDecorator(
  trialSessionsHelperComputed,
);

describe('trialSessionsHelper', () => {
  let trialSessionsPageState: typeof initialTrialSessionPageState;
  let trialSession1: TrialSessionInfoDTO;
  let trialSession2: TrialSessionInfoDTO;
  beforeEach(() => {
    trialSessionsPageState = cloneDeep(initialTrialSessionPageState);
    trialSession1 = {
      isCalendared: true,
      judge: { name: 'howdy', userId: '1' },
      proceedingType: 'Remote',
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      sessionStatus: 'Open',
      sessionType: 'Regular',
      startDate: '2022-03-01T21:00:00.000Z',
      term: 'Winter',
      termYear: '2022',
      trialLocation: 'Boise',
      trialSessionId: '294038',
    };
    trialSession2 = {
      isCalendared: true,
      judge: { name: 'howdy', userId: '2' },
      proceedingType: 'Remote',
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      sessionStatus: 'Open',
      sessionType: 'Regular',
      startDate: '2022-03-01T21:00:00.000Z',
      term: 'Winter',
      termYear: '2022',
      trialLocation: 'Boise',
      trialSessionId: '392810',
    };
    trialSessionsPageState.trialSessions = [trialSession1, trialSession2];
  });

  describe('showNoticeIssued', () => {
    it('should show the Notice Issued column when on the calendared tab', () => {
      trialSessionsPageState.filters.currentTab = 'calendared';

      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [judgeUser, judgeColvin],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showNoticeIssued).toEqual(true);
    });

    it('should NOT show the Notice Issued column  when on the new tab', () => {
      trialSessionsPageState.filters.currentTab = 'new';
      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [judgeUser, judgeColvin],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showNoticeIssued).toEqual(false);
    });
  });

  describe('showSessionStatus', () => {
    it('should show the Session Status column when on the `calendared` tab', () => {
      trialSessionsPageState.filters.currentTab = 'calendared';

      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [judgeUser, judgeColvin],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showSessionStatus).toEqual(true);
    });

    it('should NOT show the Session Status column when on the `new` tab', () => {
      trialSessionsPageState.filters.currentTab = 'new';

      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [judgeUser, judgeColvin],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showSessionStatus).toEqual(false);
    });
  });

  describe('trialSessionJudgeOptions', () => {
    it('should show the `unassigned` judge filter when on the new tab', () => {
      trialSessionsPageState.filters.currentTab = 'new';

      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [judgeUser, judgeColvin],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.trialSessionJudgeOptions[2]).toEqual({
        label: 'Unassigned',
        value: { name: 'Unassigned', userId: 'unassigned' },
      });
    });

    it('should not show the `unassigned` judge filter when on the calendared tab', () => {
      trialSessionsPageState.filters.currentTab = 'calendared';

      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [judgeUser, judgeColvin],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.trialSessionJudgeOptions.length).toEqual(2);
    });
  });

  describe('trialSessionJudges', () => {
    it('returns all current and legacy judges when the session status is closed', () => {
      trialSessionsPageState.filters.currentTab = 'calendared';
      trialSessionsPageState.filters.sessionStatus =
        SESSION_STATUS_TYPES.closed;
      const result = runCompute(trialSessionsHelper, {
        state: {
          legacyAndCurrentJudges: [judgeUser, legacyJudgeUser],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.trialSessionJudgeOptions).toEqual([
        {
          label: 'Sotomayor',
          value: {
            name: 'Sotomayor',
            userId: '43b00e5f-b78c-476c-820e-5d6ed1d58828',
          },
        },
        {
          label: 'Legacy Judge Ginsburg',
          value: {
            name: 'Legacy Judge Ginsburg',
            userId: 'dc67e189-cf3e-4ca3-a33f-91db111ec270',
          },
        },
      ]);
    });

    it('returns only current judges when the current tab is new', () => {
      trialSessionsPageState.filters.currentTab = 'new';
      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [judgeUser],
          legacyAndCurrentJudges: [legacyJudgeUser],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.trialSessionJudgeOptions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: judgeUser.name,
            value: expect.objectContaining({
              name: judgeUser.name,
              userId: judgeUser.userId,
            }),
          }),
        ]),
      );

      expect(result.trialSessionJudgeOptions).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: legacyJudgeUser.name,
            value: expect.objectContaining({
              name: legacyJudgeUser.name,
              userId: legacyJudgeUser.userId,
            }),
          }),
        ]),
      );
    });

    it('returns only current judges when the session status is open', () => {
      trialSessionsPageState.filters.sessionStatus = SESSION_STATUS_TYPES.open;
      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [judgeUser],
          legacyAndCurrentJudges: [legacyJudgeUser],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.trialSessionJudgeOptions).toEqual([
        {
          label: 'Sotomayor',
          value: {
            name: 'Sotomayor',
            userId: '43b00e5f-b78c-476c-820e-5d6ed1d58828',
          },
        },
      ]);
    });
  });

  describe('showNewTrialSession', () => {
    it('should return showNewTrialSession as true when current user has CREATE_TRIAL_SESSION permission', () => {
      trialSessionsPageState.filters.currentTab = 'new';
      const judges = [judgeUser, judgeColvin];
      const result = runCompute(trialSessionsHelper, {
        state: {
          judges,
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showNewTrialSession).toEqual(true);
    });

    it('should return showNewTrialSession as false when current user does not have CREATE_TRIAL_SESSION permission', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [judgeUser],
          permissions: getUserPermissions(judgeUser),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showNewTrialSession).toEqual(false);
    });
  });

  describe('trialSessionRows', () => {
    describe('filters', () => {
      it('should not filter when there are validation errors', () => {
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];
        trialSessionsPageState.filters.startDate = 'a';
        trialSessionsPageState.filters.endDate = 'stuff';

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(0);
      });

      it('should filter trial sessions by judge', () => {
        trialSession1.judge!.userId = '43b00e5f-b78c-476c-820e-5d6ed1d58828';
        trialSession2.judge!.userId = 'd17b07dc-6455-447e-bea3-f91d12ac5a6';
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];
        trialSessionsPageState.filters.judges = {
          'd17b07dc-6455-447e-bea3-f91d12ac5a6': {
            name: 'Colvin',
            userId: 'd17b07dc-6455-447e-bea3-f91d12ac5a6',
          },
        };

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser, judgeColvin],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(1);
      });

      it('should only show trial sessions who do not have a judge when the judge filter is "unassigned"', () => {
        trialSession1.judge = undefined;
        trialSession2.judge!.userId = '2';
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];
        trialSessionsPageState.filters.judges = {
          'd17b07dc-6455-447e-bea3-f91d12ac5a6a': {
            name: 'Colvin',
            userId: 'unassigned',
          },
        };

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(1);
        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
      });

      it('should not filter trial sessions by judge when judge filter is empty', () => {
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];
        trialSessionsPageState.filters.judges = {};
        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser, judgeColvin],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(2);
      });

      it('should show open and closed trial sessions when the current tab is calendared', () => {
        trialSession1.isCalendared = false;
        trialSession2.isCalendared = true;
        trialSession2.sessionStatus = SESSION_STATUS_TYPES.open;
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);

        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession2.trialSessionId,
        );
      });

      it('should show remote proceeding types when proceeding type is remote', () => {
        trialSession1.proceedingType = TRIAL_SESSION_PROCEEDING_TYPES.remote;
        trialSession2.proceedingType = TRIAL_SESSION_PROCEEDING_TYPES.inPerson;
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];
        trialSessionsPageState.filters.proceedingType = 'Remote';

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);

        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
      });

      it('should show in person proceeding types when proceeding type is in person', () => {
        trialSession1.proceedingType = TRIAL_SESSION_PROCEEDING_TYPES.remote;
        trialSession2.proceedingType = TRIAL_SESSION_PROCEEDING_TYPES.inPerson;
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];
        trialSessionsPageState.filters.proceedingType = 'In Person';

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);

        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession2.trialSessionId,
        );
      });

      it('should show open trial sessions when session status filter is open', () => {
        trialSession1.sessionStatus = SESSION_STATUS_TYPES.open;
        trialSession1.isCalendared = true;
        trialSession2.sessionStatus = SESSION_STATUS_TYPES.closed;
        trialSession2.isCalendared = true;
        trialSessionsPageState.filters.sessionStatus =
          SESSION_STATUS_TYPES.open;
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(1);
        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
      });

      it('should show closed trial sessions when session status filter is closed', () => {
        trialSession1.sessionStatus = SESSION_STATUS_TYPES.closed;
        trialSession1.isCalendared = true;
        trialSession2.sessionStatus = SESSION_STATUS_TYPES.open;
        trialSession2.isCalendared = true;
        trialSessionsPageState.filters.sessionStatus =
          SESSION_STATUS_TYPES.closed;
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            legacyAndCurrentJudges: [legacyJudgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(1);
        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
      });

      it('should ignore session status filter when the current tab is new', () => {
        trialSession1.sessionStatus = SESSION_STATUS_TYPES.closed;
        trialSession1.isCalendared = true;
        trialSession2.sessionStatus = SESSION_STATUS_TYPES.new;
        trialSession2.isCalendared = false;
        trialSessionsPageState.filters.sessionStatus =
          SESSION_STATUS_TYPES.closed;
        trialSessionsPageState.filters.currentTab = 'new';
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(1);
        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession2.trialSessionId,
        );
      });

      it('should show regular trial sessions when session type filter is regular', () => {
        trialSession1.sessionType = SESSION_TYPES.regular;
        trialSession2.sessionType = SESSION_TYPES.hybridSmall;
        (trialSessionsPageState.filters.sessionTypes = {
          [SESSION_TYPES.regular]: SESSION_TYPES.regular,
        }),
          (trialSessionsPageState.trialSessions = [
            trialSession1,
            trialSession2,
          ]);

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(1);
        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
      });

      it('should show trial sessions in honolulu when trial sessions when trial location filter is honolulu', () => {
        trialSession1.trialLocation = 'Honolulu, Hawaii';
        trialSession2.trialLocation = 'Jacksonville, Florida';
        trialSessionsPageState.filters.trialLocations = {
          'Honolulu, Hawaii': 'Honolulu, Hawaii',
        };
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(1);
        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
      });

      it('should show trial sessions that begin on the same selected start date', () => {
        trialSession1.startDate = '2233-02-03T00:00:00.000-05:00';
        trialSession2.startDate = '2233-02-02T00:00:00.000-05:00';
        trialSessionsPageState.filters.startDate = '02/03/2233';
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(1);
        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
      });

      it('should show trial sessions that begin on the same selected last start date regardless of time', () => {
        trialSession1.startDate = '2233-02-03T18:05:00.000-05:00';
        trialSession2.startDate = '2233-02-04T00:00:00.000-05:00';
        trialSessionsPageState.filters.endDate = '02/03/2233';
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(1);
        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
      });
    });

    describe('formatting', () => {
      it('should format trialSessions startDate, endDate, noticeIssuedDate', () => {
        trialSession1.noticeIssuedDate = '2020-05-03T21:00:00.000Z';
        trialSession1.startDate = '2020-05-03T21:00:00.000Z';
        trialSession1.estimatedEndDate = '2020-05-03T21:00:00.000Z';
        trialSessionsPageState.trialSessions = [trialSession1];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly[0]).toMatchObject({
          formattedEstimatedEndDate: '05/03/20',
          formattedNoticeIssuedDate: '05/03/2020',
          formattedStartDate: '05/03/20',
        });
      });

      it('should set the judge to "Unassigned" when the trial session does not yet have a judge assigned', () => {
        trialSession1.judge = undefined;
        trialSessionsPageState.trialSessions = [trialSession1];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly[0].judge).toEqual({
          name: 'Unassigned',
          userId: '',
        });
      });

      it('should set userIsAssignedToSession false for all sessions if there is no associated judgeUser', () => {
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judgeUser: {},
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        trialSessionsOnly.forEach(t => {
          expect(t.userIsAssignedToSession).toEqual(false);
        });
      });

      it('should set userIsAssignedToSession true for all sessions the judge user is assigned to', () => {
        trialSession1.judge!.userId = '1';
        trialSession2.judge!.userId = '2';
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judgeUser: {
              userId: '1',
            },
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        trialSessionsOnly.forEach(t => {
          if (t.trialSessionId === trialSession1.trialSessionId) {
            expect(t.userIsAssignedToSession).toEqual(true);
          } else {
            expect(t.userIsAssignedToSession).toEqual(false);
          }
        });
      });

      it('should show an alertMessage for NOTT reminders when the user has not dismissed the alert and the start day is within the reminder range', () => {
        trialSession1.dismissedAlertForNOTT = false;
        trialSession1.isCalendared = true;
        trialSession1.startDate = calculateISODate({
          howMuch: 29,
          units: 'days',
        });
        trialSessionsPageState.trialSessions = [trialSession1];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly[0].alertMessageForNOTT).toEqual(
          `The 30-day notice is due by ${formatNow(FORMATS.MMDDYY)}`,
        );
        expect(trialSessionsOnly[0].showAlertForNOTTReminder).toEqual(true);
      });
    });

    describe('sorting', () => {
      it('should order trial sessions by start date from oldest to newest', () => {
        trialSession1.startDate = '2022-03-01T21:00:00.000Z';
        trialSession2.startDate = '2020-03-01T21:00:00.000Z';
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(2);
        expect(trialSessionsOnly[0].trialSessionId).toEqual(
          trialSession2.trialSessionId,
        );
        expect(trialSessionsOnly[1].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
      });
    });

    describe('trial session weeks', () => {
      it('should insert one trialSessionWeek row when two trial sessions are within the same week(week starts on Monday EST)', () => {
        trialSession1.startDate = '2024-09-03T21:00:00.000Z'; // A Tuesday
        trialSession2.startDate = '2024-09-05T21:00:00.000Z'; // A Thursday
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionWeeks =
          result.trialSessionRows.filter(isTrialSessionWeek);
        expect(trialSessionWeeks).toEqual([
          {
            formattedSessionWeekStartDate: 'September 2, 2024',
            sessionWeekStartDate: '2024-09-02T04:00:00.000+00:00',
          },
        ]);
      });

      it('should insert two trialSessionWeek rows when two trial sessions are not within the same week(week starts on Monday EST)', () => {
        trialSession1.startDate = '2024-09-03T21:00:00.000Z'; // A Tuesday
        trialSession2.startDate = '2024-09-12T21:00:00.000Z'; // A Thursday next week
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judges: [judgeUser],
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionWeeks =
          result.trialSessionRows.filter(isTrialSessionWeek);
        expect(trialSessionWeeks).toEqual([
          {
            formattedSessionWeekStartDate: 'September 2, 2024',
            sessionWeekStartDate: '2024-09-02T04:00:00.000+00:00',
          },
          {
            formattedSessionWeekStartDate: 'September 9, 2024',
            sessionWeekStartDate: '2024-09-09T04:00:00.000+00:00',
          },
        ]);
      });
    });
  });
});
