import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { TrialSession } from '../../../../shared/src/business/entities/trialSessions/TrialSession';
import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const trialSessionHeaderHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  isStandaloneSession: boolean;
  nameToDisplay: string;
  showBatchDownloadButton: boolean;
  showPrintCalendarButton: boolean;
  showPrintPaperServicePDFsButton: boolean;
  showSwitchToSessionDetail: boolean;
  showSwitchToWorkingCopy: boolean;
} => {
  const { USER_ROLES } = applicationContext.getConstants();

  const currentUser = applicationContext.getCurrentUser();

  const trialSession = get(state.trialSession);
  const judgeUser = get(state.judgeUser);

  if (!trialSession) return {};

  const formattedTrialSession = applicationContext
    .getUtilities()
    .getFormattedTrialSessionDetails({
      applicationContext,
      trialSession,
    });

  const isTrialClerk = currentUser.role === USER_ROLES.trialClerk;
  const isJudgeAssignedToSession =
    judgeUser && trialSession.judge?.userId === judgeUser.userId;
  const isTrialClerkAssignedToSession =
    isTrialClerk && trialSession.trialClerk?.userId === currentUser.userId;
  const isAssigned = isJudgeAssignedToSession || isTrialClerkAssignedToSession;

  const showSwitchToSessionDetail =
    isAssigned && 'TrialSessionWorkingCopy'.includes(get(state.currentPage));
  const showSwitchToWorkingCopy =
    isAssigned && 'TrialSessionDetail'.includes(get(state.currentPage));
  const showPrintPaperServicePDFsButton =
    formattedTrialSession.paperServicePdfs.length > 0 &&
    get(state.permissions!.TRIAL_SESSIONS);

  return {
    isStandaloneSession: TrialSession.isStandaloneRemote(
      formattedTrialSession.sessionScope,
    ),
    nameToDisplay: isTrialClerk
      ? currentUser.name
      : formattedTrialSession.formattedJudge,
    showBatchDownloadButton: !isEmpty(formattedTrialSession.allCases),
    showPrintCalendarButton: formattedTrialSession.isCalendared,
    showPrintPaperServicePDFsButton,
    showSwitchToSessionDetail,
    showSwitchToWorkingCopy,
  };
};
