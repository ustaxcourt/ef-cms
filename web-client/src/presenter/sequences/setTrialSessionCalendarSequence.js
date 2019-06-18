import { clearModalAction } from '../actions/clearModalAction';
import { getAssociatedCasesForTrialSessionAction } from '../actions/TrialSession/getAssociatedCasesForTrialSessionAction';
import { getSetTrialSessionCalendarAlertSuccessAction } from '../actions/TrialSession/getSetTrialSessionCalendarAlertSuccessAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAssociatedCasesOnTrialSessionAction } from '../actions/TrialSession/setAssociatedCasesOnTrialSessionAction';
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
  getAssociatedCasesForTrialSessionAction,
  setAssociatedCasesOnTrialSessionAction,
  getSetTrialSessionCalendarAlertSuccessAction,
  setAlertSuccessAction,
  unsetFormSubmittingAction,
];
