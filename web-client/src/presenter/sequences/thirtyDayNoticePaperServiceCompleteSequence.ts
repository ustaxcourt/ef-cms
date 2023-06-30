import { clearModalStateAction } from '../actions/clearModalStateAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setNottServiceCompleteAction } from '../actions/TrialSession/setNottServiceCompleteAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
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
      setCurrentPageAction('PrintPaperTrialNotices'),
    ],
  },
];
