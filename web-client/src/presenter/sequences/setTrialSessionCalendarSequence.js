import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getSetTrialSessionCalendarAlertSuccessAction } from '../actions/TrialSession/getSetTrialSessionCalendarAlertSuccessAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { navigateToPdfPreviewAction } from '../actions/navigateToPdfPreviewAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setAlternateBackLocationAction } from '../actions/setAlternateBackLocationAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setNoticesForCalendaredTrialSessionAction } from '../actions/TrialSession/setNoticesForCalendaredTrialSessionAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTrialSessionCalendarAction } from '../actions/TrialSession/setTrialSessionCalendarAction';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const setTrialSessionCalendarSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  clearScreenMetadataAction,
  setTrialSessionCalendarAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  getCalendaredCasesForTrialSessionAction,
  setCalendaredCasesOnTrialSessionAction,
  setNoticesForCalendaredTrialSessionAction,
  {
    electronic: [
      getSetTrialSessionCalendarAlertSuccessAction,
      setAlertSuccessAction,
    ],
    paper: [
      setPdfPreviewUrlSequence,
      setAlternateBackLocationAction,
      setTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
      navigateToPdfPreviewAction,
    ],
  },
  clearModalAction,
]);
