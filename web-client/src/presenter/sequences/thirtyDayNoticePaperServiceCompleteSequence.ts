import { clearModalStateAction } from '../actions/clearModalStateAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setNottServiceCompleteAction } from '../actions/TrialSession/setNottServiceCompleteAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const thirtyDayNoticePaperServiceCompleteSequence = [
  unsetWaitingForResponseAction,
  setNottServiceCompleteAction,
  clearModalStateAction,
  hasPaperAction,
  {
    electronic: [],
    paper: [
      setPdfPreviewUrlSequence,
      setTrialSessionCalendarAlertWarningAction,
      setAlertWarningAction,
      setupCurrentPageAction('PrintPaperTrialNotices'),
    ],
  },
];
