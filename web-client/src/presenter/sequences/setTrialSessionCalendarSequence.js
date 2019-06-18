import { clearModalAction } from '../actions/clearModalAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getSetTrialSessionCalendarAlertSuccessAction } from '../actions/TrialSession/getSetTrialSessionCalendarAlertSuccessAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setTrialSessionCalendarAction } from '../actions/TrialSession/setTrialSessionCalendarAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const setTrialSessionCalendarSequence = [
  setFormSubmittingAction,
  setTrialSessionCalendarAction,
  clearModalAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  getCalendaredCasesForTrialSessionAction,
  setCalendaredCasesOnTrialSessionAction,
  getSetTrialSessionCalendarAlertSuccessAction,
  setAlertSuccessAction,
  unsetFormSubmittingAction,
];
