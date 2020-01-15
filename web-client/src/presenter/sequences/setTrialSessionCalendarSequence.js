import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getSetTrialSessionCalendarAlertSuccessAction } from '../actions/TrialSession/getSetTrialSessionCalendarAlertSuccessAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setNoticesForCalendaredTrialSessionAction } from '../actions/TrialSession/setNoticesForCalendaredTrialSessionAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTrialSessionCalendarAction } from '../actions/TrialSession/setTrialSessionCalendarAction';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { state } from 'cerebral';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const setTrialSessionCalendarSequence = [
  clearAlertsAction,
  setWaitingForResponseAction,
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
      ...setPdfPreviewUrlSequence,
      setTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
      set(state.currentPage, 'SimplePdfPreviewPage'),
    ],
  },
  clearModalAction,
  unsetWaitingForResponseAction,
];
