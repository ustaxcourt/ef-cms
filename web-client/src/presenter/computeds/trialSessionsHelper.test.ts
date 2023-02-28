import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { runCompute } from 'cerebral/test';
import { trialSessionsHelper as trialSessionsHelperComputed } from './trialSessionsHelper';
import { withAppContextDecorator } from '../../withAppContext';

let currentUser = {
  role: ROLES.judge,
  userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
};

const trialSessionsHelper = withAppContextDecorator(
  trialSessionsHelperComputed,
  {
    getCurrentUser: () => currentUser,
  },
);

describe('trialSessionsHelper', () => {
  it('should show the Notice Issued column for `open` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        currentViewMetadata: {
          trialSessions: {
            tab: 'open',
          },
        },
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
      },
    });

    expect(result.showNoticeIssued).toEqual(false);
  });

  it('should show the Session Status column for `all` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        currentViewMetadata: {
          trialSessions: {
            tab: 'all',
          },
        },
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
      },
    });

    expect(result.showSessionStatus).toEqual(false);
  });

  it('should show 0 additional table columns for `new` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        currentViewMetadata: {
          trialSessions: {
            tab: 'new',
          },
        },
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
      },
    });

    expect(result.additionalColumnsShown).toEqual(1);
  });

  it('should show the `unassigned` judge filter for `new` sessions', () => {
    const result = runCompute(trialSessionsHelper, {
      state: {
        currentViewMetadata: {
          trialSessions: {
            tab: 'new',
          },
        },
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
      },
    });

    expect(result.showUnassignedJudgeFilter).toBeFalsy();
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
});
