import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { createPaperServicePdfForCasesAction } from '../actions/TrialSession/createPaperServicePdfForCasesAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getNoticeGenerationSuccessMessageAction } from '../actions/TrialSession/getNoticeGenerationSuccessMessageAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setPrintPaperDoneUrlAction } from '../actions/TrialSession/setPrintPaperDoneUrlAction';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { shouldCreatePaperServicePdfForCasesAction } from '../actions/shouldCreatePaperServicePdfForCasesAction';
import { shouldRefreshCaseAction } from '../actions/shouldRefreshCaseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const noticeGenerationCompleteSequence = [
  shouldCreatePaperServicePdfForCasesAction,
  {
    no: [],
    yes: [createPaperServicePdfForCasesAction],
  },
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
