import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { mergeCaseOrderIntoCalendaredCasesAction } from '../actions/TrialSession/mergeCaseOrderIntoCalendaredCasesAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setNoticesForCalendaredTrialSessionAction } from '../actions/TrialSession/setNoticesForCalendaredTrialSessionAction';
import { setTrialSessionCalendarAction } from '../actions/TrialSession/setTrialSessionCalendarAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';

export const setTrialSessionCalendarSequence = [
  clearModalStateAction,
  clearModalAction,
  setWaitingForResponseAction,
  clearAlertsAction,
  clearScreenMetadataAction,
  setTrialSessionCalendarAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  getCalendaredCasesForTrialSessionAction,
  setCalendaredCasesOnTrialSessionAction,
  mergeCaseOrderIntoCalendaredCasesAction,
  setNoticesForCalendaredTrialSessionAction,
];
