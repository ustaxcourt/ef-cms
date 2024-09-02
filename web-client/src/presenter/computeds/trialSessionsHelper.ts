import { Get } from 'cerebral';
import { RawUser } from '@shared/business/entities/User';
import { state } from '@web-client/presenter/app.cerebral';

export const trialSessionsHelper = (
  get: Get,
): {
  additionalColumnsShown: number;
  showNewTrialSession: boolean;
  showNoticeIssued: boolean;
  showSessionStatus: boolean;
  showUnassignedJudgeFilter: boolean;
  trialSessionJudges: RawUser[];
} => {
  const permissions = get(state.permissions)!;
  const tab = get(state.trialSessionsPage.filters.currentTab);

  const isNewTab = tab === 'new';
  const isCalendared = tab === 'calendared';

  let additionalColumnsShown = 0;
  if (isCalendared) {
    additionalColumnsShown = 1;
  }

  const showCurrentJudgesOnly = isNewTab;

  let trialSessionJudges;
  if (showCurrentJudgesOnly) {
    trialSessionJudges = get(state.judges);
  } else {
    trialSessionJudges = get(state.legacyAndCurrentJudges);
  }

  return {
    additionalColumnsShown,
    showNewTrialSession: permissions.CREATE_TRIAL_SESSION,
    showNoticeIssued: isCalendared,
    showSessionStatus: isCalendared,
    showUnassignedJudgeFilter: isNewTab,
    trialSessionJudges,
  };
};
