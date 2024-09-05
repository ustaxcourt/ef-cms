import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { cloneDeep } from 'lodash';
import { docketClerk1User, judgeUser } from '@shared/test/mockUsers';
import { getUserPermissions } from '@shared/authorization/getUserPermissions';
import { initialTrialSessionPageState } from '../state/trialSessionsPageState';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionsHelper as trialSessionsHelperComputed } from './trialSessionsHelper';
import { withAppContextDecorator } from '../../withAppContext';

const trialSessionsHelper = withAppContextDecorator(
  trialSessionsHelperComputed,
);

describe('trialSessionsHelper', () => {
  let trialSessionsPageState: typeof initialTrialSessionPageState;
  beforeEach(() => {
    trialSessionsPageState = cloneDeep(initialTrialSessionPageState);
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
});
