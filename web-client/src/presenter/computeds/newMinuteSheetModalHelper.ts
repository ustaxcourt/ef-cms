import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const newMinuteSheetModalHelper = (
  get: Get,
): {
  caseInfo: any;
  editUnscheduledMinutesList: Array<{
    docketNumber: string;
    docketNumberWithSuffix?: string;
    caseCaption?: string;
  }>;
  hasSearched: boolean;
  isCaseAlreadyOnTrialSession: boolean;
  noResultsFound: boolean;
  showCaseConfirmation: boolean;
  trialSessionId: string;
} => {
  const caseInfo = get(state.modal.caseInfo);
  const hasSearched = get(state.modal.hasSearched) || false;
  const noResultsFound = get(state.modal.noResultsFound) || false;
  const isCaseAlreadyOnTrialSession =
    get(state.modal.isCaseAlreadyOnTrialSession) || false;
  const trialSession = get(state.trialSession);
  const trialSessionId = trialSession?.trialSessionId || '';

  const editUnscheduledMinutesList =
    get(state.modal.editUnscheduledMinutesList) || [];

  const showCaseConfirmation =
    hasSearched && !!caseInfo && !noResultsFound && !isCaseAlreadyOnTrialSession;

  return {
    caseInfo,
    editUnscheduledMinutesList,
    hasSearched,
    isCaseAlreadyOnTrialSession,
    noResultsFound,
    showCaseConfirmation,
    trialSessionId,
  };
};
