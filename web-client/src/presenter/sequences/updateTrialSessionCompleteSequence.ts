import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCompleteTrialSessionAlertSuccessAction } from '../actions/getCompleteTrialSessionAlertSuccessAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { isDismissingThirtyDayAlertAction } from '../actions/isDismissingThirtyDayAlertAction';
import { navigateToTrialSessionDetailAction } from '../actions/TrialSession/navigateToTrialSessionDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setPrintPaperDoneUrlAction } from '../actions/TrialSession/setPrintPaperDoneUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
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
  isDismissingThirtyDayAlertAction,
  {
    no: [
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
          setPrintPaperDoneUrlAction,
          setCurrentPageAction('PrintPaperTrialNotices'),
          setTrialSessionCalendarAlertWarningAction,
          setAlertWarningAction,
        ],
      },
    ],
    yes: [getTrialSessionDetailsAction, setTrialSessionDetailsAction],
  },
];
