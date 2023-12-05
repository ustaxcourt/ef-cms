import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCompleteTrialSessionAlertSuccessAction } from '../actions/getCompleteTrialSessionAlertSuccessAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { navigateToPrintPaperTrialNoticesAction } from '@web-client/presenter/actions/TrialSession/navigateToPrintPaperTrialNoticesAction';
import { navigateToTrialSessionDetailAction } from '../actions/TrialSession/navigateToTrialSessionDetailAction';
import { sequence } from 'cerebral';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
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
    paper: [navigateToPrintPaperTrialNoticesAction],
  },
]);
