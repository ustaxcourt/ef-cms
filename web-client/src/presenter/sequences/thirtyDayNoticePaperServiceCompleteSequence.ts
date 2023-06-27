import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getNoticeGenerationSuccessMessageAction } from '../actions/TrialSession/getNoticeGenerationSuccessMessageAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setNottServiceCompleteAction } from '../actions/TrialSession/setNottServiceCompleteAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setPrintPaperDoneUrlAction } from '../actions/TrialSession/setPrintPaperDoneUrlAction';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const thirtyDayNoticePaperServiceCompleteSequence = [
  unsetWaitingForResponseAction,
  setNottServiceCompleteAction,
  clearModalStateAction,
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
