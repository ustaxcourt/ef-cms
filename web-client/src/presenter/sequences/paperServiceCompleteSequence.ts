import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getNoticeGenerationSuccessMessageAction } from '../actions/TrialSession/getNoticeGenerationSuccessMessageAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const paperServiceCompleteSequence = [
  unsetWaitingForResponseAction,
  clearModalStateAction,
  hasPaperAction,
  {
    electronic: [
      getNoticeGenerationSuccessMessageAction,
      setAlertSuccessAction,
    ],
    paper: [
      setPdfPreviewUrlSequence,
      setupCurrentPageAction('PrintPaperTrialNotices'),
      setTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
    ],
  },
];
