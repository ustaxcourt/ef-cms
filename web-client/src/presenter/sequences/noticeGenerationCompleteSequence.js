import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getAddCaseToTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/getAddCaseToTrialSessionCalendarAlertWarningAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getNoticeGenerationSuccessMessageAction } from '../actions/TrialSession/getNoticeGenerationSuccessMessageAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { navigateToPdfPreviewAction } from '../actions/navigateToPdfPreviewAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setAlternateBackLocationAction } from '../actions/setAlternateBackLocationAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';

export const noticeGenerationCompleteSequence = [
  stopWebSocketConnectionAction,
  getCaseAction,
  setCaseAction,
  hasPaperAction,
  {
    electronic: [
      clearModalStateAction,
      clearModalAction,
      getNoticeGenerationSuccessMessageAction,
      setAlertSuccessAction,
    ],
    paper: [
      clearModalStateAction,
      ...setPdfPreviewUrlSequence,
      setAlternateBackLocationAction,
      navigateToPdfPreviewAction,
      getAddCaseToTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
    ],
  },
];
