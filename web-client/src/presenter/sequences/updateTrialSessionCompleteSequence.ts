import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCompleteTrialSessionAlertSuccessAction } from '../actions/getCompleteTrialSessionAlertSuccessAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { navigateToPrintPaperTrialNoticesAction } from '@web-client/presenter/actions/TrialSession/navigateToPrintPaperTrialNoticesAction';
import { navigateToTrialSessionDetailAction } from '../actions/TrialSession/navigateToTrialSessionDetailAction';
import { sequence } from 'cerebral';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const updateTrialSessionCompleteSequence = sequence<{
  fileId?: string;
  hasPaper: boolean;
}>([
  unsetWaitingForResponseAction,
  clearModalStateAction,
  clearModalAction,
  hasPaperAction,
  {
    electronic: [
      getCompleteTrialSessionAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToTrialSessionDetailAction,
    ],
    paper: [
      setPdfPreviewUrlSequence,
      setTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
      navigateToPrintPaperTrialNoticesAction,
    ],
  },
]);
