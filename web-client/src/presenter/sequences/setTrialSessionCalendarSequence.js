import { canSetTrialSessionToCalendarAction } from '../actions/TrialSession/canSetTrialSessionToCalendarAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getSetTrialSessionCalendarAlertSuccessAction } from '../actions/TrialSession/getSetTrialSessionCalendarAlertSuccessAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setTrialSessionCalendarAction } from '../actions/TrialSession/setTrialSessionCalendarAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const setTrialSessionCalendarSequence = [
  setWaitingForResponseAction,
  canSetTrialSessionToCalendarAction,
  {
    no: [setAlertWarningAction, clearModalAction],
    yes: [
      setTrialSessionCalendarAction,
      getTrialSessionDetailsAction,
      setTrialSessionDetailsAction,
      getCalendaredCasesForTrialSessionAction,
      setCalendaredCasesOnTrialSessionAction,
      getSetTrialSessionCalendarAlertSuccessAction,
      setAlertSuccessAction,
    ],
  },
  unsetWaitingForResponseAction,
];
