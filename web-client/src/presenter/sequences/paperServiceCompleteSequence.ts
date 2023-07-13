import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getNoticeGenerationSuccessMessageAction } from '../actions/TrialSession/getNoticeGenerationSuccessMessageAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setPrintPaperDoneUrlAction } from '../actions/TrialSession/setPrintPaperDoneUrlAction';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { shouldRefreshCaseAction } from '../actions/shouldRefreshCaseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const paperServiceCompleteSequence = [
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
      getNoticeGenerationSuccessMessageAction,
      setAlertSuccessAction,
    ],
    paper: [
      setPdfPreviewUrlSequence,
      setPrintPaperDoneUrlAction,
      setCurrentPageAction('PrintPaperTrialNotices'),
      setTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
    ],
  },
];
