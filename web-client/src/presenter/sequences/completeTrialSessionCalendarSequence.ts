import { getCalendaredCasesForTrialSessionAction } from '@web-client/presenter/actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getTrialSessionDetailsAction } from '@web-client/presenter/actions/TrialSession/getTrialSessionDetailsAction';
import { mergeCaseOrderIntoCalendaredCasesAction } from '@web-client/presenter/actions/TrialSession/mergeCaseOrderIntoCalendaredCasesAction';
import { setCalendaredCasesOnTrialSessionAction } from '@web-client/presenter/actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setNoticesForCalendaredTrialSessionAction } from '@web-client/presenter/actions/TrialSession/setNoticesForCalendaredTrialSessionAction';
import { setTrialSessionDetailsAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionDetailsAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const completeTrialSessionCalendarSequence = [
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  getCalendaredCasesForTrialSessionAction,
  setCalendaredCasesOnTrialSessionAction,
  mergeCaseOrderIntoCalendaredCasesAction,
  setNoticesForCalendaredTrialSessionAction,
  unsetWaitingForResponseAction,
] as unknown as (props: { trialSessionId: string }) => void;
