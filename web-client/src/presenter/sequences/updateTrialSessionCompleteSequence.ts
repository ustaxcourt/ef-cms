import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCompleteTrialSessionAlertSuccessAction } from '../actions/getCompleteTrialSessionAlertSuccessAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { navigateToPrintPaperTrialNoticesAction } from '@web-client/presenter/actions/TrialSession/navigateToPrintPaperTrialNoticesAction';
import { navigateToTrialSessionDetailsAction } from '../actions/TrialSession/navigateToTrialSessionDetailsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const updateTrialSessionCompleteSequence = [
  unsetWaitingForResponseAction,
  clearModalStateAction,
  clearModalAction,
  hasPaperAction,
  {
    electronic: [
      getCompleteTrialSessionAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToTrialSessionDetailsAction,
    ],
    paper: [navigateToPrintPaperTrialNoticesAction],
  },
] as unknown as (props: { fileId?: string; hasPaper: boolean }) => void;
