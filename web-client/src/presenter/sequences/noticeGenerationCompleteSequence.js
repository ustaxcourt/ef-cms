import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getNoticeGenerationSuccessMessageAction } from '../actions/TrialSession/getNoticeGenerationSuccessMessageAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { shouldRefreshCaseAction } from '../actions/shouldRefreshCaseAction';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const noticeGenerationCompleteSequence = [
  unsetWaitingForResponseAction,
  stopWebSocketConnectionAction,
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
      setCurrentPageAction('PrintPaperTrialNotices'),
      setTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
    ],
  },
];
