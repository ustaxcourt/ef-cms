import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCaseAction } from '../actions/getCaseAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { navigateToTrialSessionDetailAction } from '../actions/TrialSession/navigateToTrialSessionDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { shouldRefreshCaseAction } from '../actions/shouldRefreshCaseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const updateTrialSessionCompleteSequence = [
  unsetWaitingForResponseAction,
  clearModalStateAction,
  clearModalAction,
  shouldRefreshCaseAction,
  {
    no: [],
    yes: [getCaseAction, setCaseAction],
  },
  hasPaperAction,
  {
    electronic: [
      () => ({
        alertSuccess: {
          message: 'Trial session updated.',
        },
      }),
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToTrialSessionDetailAction,
    ],
    paper: [
      setPdfPreviewUrlSequence,
      setCurrentPageAction('PrintPaperTrialNotices'),
      setTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
    ],
  },
];
