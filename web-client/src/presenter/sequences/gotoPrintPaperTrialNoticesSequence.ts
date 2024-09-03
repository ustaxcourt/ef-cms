import { getPaperServicePdfUrlAction } from '@web-client/presenter/actions/TrialSession/getPaperServicePdfUrlAction';
import { setAlertWarningAction } from '@web-client/presenter/actions/setAlertWarningAction';
import { setPdfPreviewUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setTrialSessionCalendarAlertWarningAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { setTrialSessionIdAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionIdAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const gotoPrintPaperTrialNoticesSequence = [
  setTrialSessionCalendarAlertWarningAction,
  setAlertWarningAction,
  setTrialSessionIdAction,
  getPaperServicePdfUrlAction,
  setPdfPreviewUrlAction,
  setupCurrentPageAction('PrintPaperTrialNotices'),
] as unknown as (props: { fileId: string; trialSessionId: string }) => void;
