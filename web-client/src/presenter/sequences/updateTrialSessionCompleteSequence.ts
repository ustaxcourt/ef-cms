import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCompleteTrialSessionAlertSuccessAction } from '../actions/getCompleteTrialSessionAlertSuccessAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { navigateToTrialSessionDetailAction } from '../actions/TrialSession/navigateToTrialSessionDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
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
      navigateToTrialSessionDetailAction,
    ],
    paper: [
      setPdfPreviewUrlSequence,
      setupCurrentPageAction('PrintPaperTrialNotices'),
      setTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
    ],
  },
];
