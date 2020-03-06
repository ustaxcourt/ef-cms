import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getNoticeGenerationSuccessMessageAction } from '../actions/TrialSession/getNoticeGenerationSuccessMessageAction';

import { hasPaperAction } from '../actions/hasPaperAction';
import { navigateToPdfPreviewAction } from '../actions/navigateToPdfPreviewAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCaseAction } from '../actions/setCaseAction';

import { setAlternateBackLocationAction } from '../actions/setAlternateBackLocationAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { shouldRefreshCaseAction } from '../actions/shouldRefreshCaseAction';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';

export const noticeGenerationCompleteSequence = [
  stopWebSocketConnectionAction,
  shouldRefreshCaseAction,
  {
    no: [() => console.log('no')],
    yes: [() => console.log('yes'), getCaseAction, setCaseAction],
  },
  clearModalStateAction,
  clearModalAction,
  hasPaperAction,
  {
    electronic: [
      () => console.log('electronic'),
      getNoticeGenerationSuccessMessageAction,
      setAlertSuccessAction,
    ],
    paper: [
      () => console.log('paper'),

      ...setPdfPreviewUrlSequence,
      setAlternateBackLocationAction,
      navigateToPdfPreviewAction,
      setTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
    ],
  },
];
