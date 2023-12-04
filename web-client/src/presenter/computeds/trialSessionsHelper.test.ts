import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { docketClerk1User, judgeUser } from '@shared/test/mockUsers';
import { getUserPermissions } from '@shared/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionsHelper as trialSessionsHelperComputed } from './trialSessionsHelper';
import { withAppContextDecorator } from '../../withAppContext';

const trialSessionsHelper = withAppContextDecorator(
  trialSessionsHelperComputed,
);

describe('trialSessionsHelper', () => {
  describe('showNoticeIssued', () => {
    it('should show the Notice Issued column for `open` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'open',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showNoticeIssued).toEqual(true);
    });

    it('should NOT show the Notice Issued column for `new` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'new',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showNoticeIssued).toEqual(false);
    });

    it('should NOT show the Notice Issued column for `closed` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'closed',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showNoticeIssued).toEqual(false);
    });

    it('should NOT show the Notice Issued column for `all` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'all',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showNoticeIssued).toEqual(false);
    });
  });

  describe('showSessionStatus', () => {
    it('should show the Session Status column for `all` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'all',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showSessionStatus).toEqual(true);
    });

    it('should NOT show the Session Status column for `new` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'new',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showSessionStatus).toEqual(false);
    });

    it('should NOT show the Session Status column for `open` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'open',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showSessionStatus).toEqual(false);
    });

    it('should NOT show the Session Status column for `closed` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'closed',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showSessionStatus).toEqual(false);
    });
  });

  describe('additionalColumnsShown', () => {
    it('should show 0 additional table columns for `new` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'new',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.additionalColumnsShown).toEqual(0);
    });

    it('should show 0 additional table columns for `closed` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'closed',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.additionalColumnsShown).toEqual(0);
    });

    it('should show 1 additional table column for `open` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'open',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.additionalColumnsShown).toEqual(1);
    });

    it('should show 1 additional table column for `all` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'all',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.additionalColumnsShown).toEqual(1);
    });
  });

  describe('showUnassignedJudgeFilter', () => {
    it('should show the `unassigned` judge filter for `new` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'new',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showUnassignedJudgeFilter).toBeTruthy();
    });

    it('should NOT show the `unassigned` judge filter for `open` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'open',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showUnassignedJudgeFilter).toBeFalsy();
    });

    it('should NOT show the `unassigned` judge filter for `closed` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'close',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showUnassignedJudgeFilter).toBeFalsy();
    });

    it('should NOT show the `unassigned` judge filter for `all` sessions', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'all',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showUnassignedJudgeFilter).toBeFalsy();
    });
  });

  describe('trialSessionJudges', () => {
    it('returns only non-legacy judges when state.currentViewMetadata.trialSessions.tab is Open', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'open',
            },
          },
          judges: [
            { name: 'I am not a legacy judge part 2', role: ROLES.judge },
          ],
          legacyAndCurrentJudges: [
            { name: 'I am not a legacy judge', role: ROLES.judge },
            { name: 'I am a legacy judge', role: ROLES.legacyJudge },
          ],
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.trialSessionJudges).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'I am not a legacy judge part 2',
            role: ROLES.judge,
          }),
        ]),
      );
      expect(result.trialSessionJudges).not.toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'I am a legacy judge',
            role: ROLES.legacyJudge,
          }),
        ]),
      );
    });

    it('returns only non-legacy judges when state.currentViewMetadata.trialSessions.tab is New', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'new',
            },
          },
          judges: [
            { name: 'I am not a legacy judge part 2', role: ROLES.judge },
          ],
          legacyAndCurrentJudges: [
            { name: 'I am not a legacy judge', role: ROLES.judge },
            { name: 'I am a legacy judge', role: ROLES.legacyJudge },
          ],
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.trialSessionJudges).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'I am not a legacy judge part 2',
            role: ROLES.judge,
          }),
        ]),
      );
      expect(result.trialSessionJudges).not.toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'I am a legacy judge',
            role: ROLES.legacyJudge,
          }),
        ]),
      );
    });

    it('returns all current and legacy judges when state.currentViewMetadata.trialSessions.tab is Closed', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'closed',
            },
          },
          judges: [
            { name: 'I am not a legacy judge part 2', role: ROLES.judge },
          ],
          legacyAndCurrentJudges: [
            { name: 'I am not a legacy judge', role: ROLES.judge },
            { name: 'I am a legacy judge', role: ROLES.legacyJudge },
          ],
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.trialSessionJudges).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'I am not a legacy judge',
            role: ROLES.judge,
          }),
        ]),
      );
      expect(result.trialSessionJudges).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'I am a legacy judge',
            role: ROLES.legacyJudge,
          }),
        ]),
      );
    });

    it('returns all current and legacy judges when state.currentViewMetadata.trialSessions.tab is All', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'all',
            },
          },
          judges: [
            { name: 'I am not a legacy judge part 2', role: ROLES.judge },
          ],
          legacyAndCurrentJudges: [
            { name: 'I am not a legacy judge', role: ROLES.judge },
            { name: 'I am a legacy judge', role: ROLES.legacyJudge },
          ],
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.trialSessionJudges).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'I am not a legacy judge',
            role: ROLES.judge,
          }),
        ]),
      );
      expect(result.trialSessionJudges).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'I am a legacy judge',
            role: ROLES.legacyJudge,
          }),
        ]),
      );
    });
  });

  describe('showNewTrialSession', () => {
    it('should return showNewTrialSession as true when current user has CREATE_TRIAL_SESSION permission', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'open',
            },
          },
          permissions: getUserPermissions(docketClerk1User),
        },
      });

      expect(result.showNewTrialSession).toEqual(true);
    });

    it('should return showNewTrialSession as false when current user does not have CREATE_TRIAL_SESSION permission', () => {
      const result = runCompute(trialSessionsHelper, {
        state: {
          currentViewMetadata: {
            trialSessions: {
              tab: 'open',
            },
          },
          permissions: getUserPermissions(judgeUser),
        },
      });

      expect(result.showNewTrialSession).toEqual(false);
    });
  });
});
