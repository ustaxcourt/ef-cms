import {
  ROLES,
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { cloneDeep } from 'lodash';
import { docketClerk1User, judgeUser } from '@shared/test/mockUsers';
import { getUserPermissions } from '@shared/authorization/getUserPermissions';
import { initialTrialSessionPageState } from '../state/trialSessionsPageState';
import {
  isTrialSessionRow,
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
  });

  describe('showNoticeIssued', () => {
    it('should show the Notice Issued column when on the calendared tab', () => {
      trialSessionsPageState.filters.currentTab = 'calendared';

      const result = runCompute(trialSessionsHelper, {
        state: {
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
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showSessionStatus).toEqual(false);
    });
  });

  describe('showUnassignedJudgeFilter', () => {
    it('should show the `unassigned` judge filter when on the new tab', () => {
      trialSessionsPageState.filters.currentTab = 'new';

      const result = runCompute(trialSessionsHelper, {
        state: {
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showUnassignedJudgeFilter).toBeTruthy();
    });

    it('should show the `unassigned` judge filter when on the calendared tab', () => {
      trialSessionsPageState.filters.currentTab = 'calendared';

      const result = runCompute(trialSessionsHelper, {
        state: {
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showUnassignedJudgeFilter).toEqual(false);
    });
  });

  describe('trialSessionJudges', () => {
    it('returns all current and legacy judges when the current tab is calendared', () => {
      trialSessionsPageState.filters.currentTab = 'calendared';
      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [
            { name: 'I am not a legacy judge part 2', role: ROLES.judge },
          ],
          legacyAndCurrentJudges: [
            { name: 'I am not a legacy judge', role: ROLES.judge },
            { name: 'I am a legacy judge', role: ROLES.legacyJudge },
          ],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.trialSessionJudges).toEqual([
        { name: 'I am not a legacy judge', role: ROLES.judge },
        { name: 'I am a legacy judge', role: ROLES.legacyJudge },
      ]);
    });

    it('returns only non-legacy judges when the current tab is new', () => {
      trialSessionsPageState.filters.currentTab = 'new';
      const result = runCompute(trialSessionsHelper, {
        state: {
          judges: [
            { name: 'I am not a legacy judge part 2', role: ROLES.judge },
          ],
          legacyAndCurrentJudges: [
            { name: 'I am not a legacy judge', role: ROLES.judge },
            { name: 'I am a legacy judge', role: ROLES.legacyJudge },
          ],
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.trialSessionJudges).toEqual([
        { name: 'I am not a legacy judge part 2', role: ROLES.judge },
      ]);
    });
  });

  describe('showNewTrialSession', () => {
    it('should return showNewTrialSession as true when current user has CREATE_TRIAL_SESSION permission', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          permissions: getUserPermissions(docketClerk1User),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showNewTrialSession).toEqual(true);
    });

    it('should return showNewTrialSession as false when current user does not have CREATE_TRIAL_SESSION permission', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          permissions: getUserPermissions(judgeUser),
          trialSessionsPage: trialSessionsPageState,
        },
      });

      expect(result.showNewTrialSession).toEqual(false);
    });
  });

  describe('trialSessionRows', () => {
    describe('filters', () => {
      it('should filter trial sessions by judge', () => {
        trialSession1.judge!.userId = '1';
        trialSession2.judge!.userId = '2';
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];
        trialSessionsPageState.filters.judgeId = '1';

        const result = runCompute(trialSessionsHelper, {
          state: {
            permissions: getUserPermissions(docketClerk1User),
            trialSessionsPage: trialSessionsPageState,
          },
        });

        const trialSessionsOnly =
          result.trialSessionRows.filter(isTrialSessionRow);
        expect(trialSessionsOnly.length).toEqual(1);
      });

      it('should not filter trial sessions by judge when judge filter is All', () => {
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];
        trialSessionsPageState.filters.judgeId = 'All';

        const result = runCompute(trialSessionsHelper, {
          state: {
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

        const result = runCompute(trialSessionsHelper, {
          state: {
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
        trialSessionsPageState.filters.sessionType = SESSION_TYPES.regular;
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
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
        trialSessionsPageState.filters.trialLocation = 'Honolulu, Hawaii';
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
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
      it('sets userIsAssignedToSession false for all sessions if there is no associated judgeUser', () => {
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judgeUser: {},
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
      it('sets userIsAssignedToSession true for all sessions the judge user is assigned to', () => {
        trialSession1.judge!.userId = '1';
        trialSession2.judge!.userId = '2';
        trialSessionsPageState.trialSessions = [trialSession1, trialSession2];

        const result = runCompute(trialSessionsHelper, {
          state: {
            judgeUser: {
              userId: '1',
            },
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
    });
  });
});
