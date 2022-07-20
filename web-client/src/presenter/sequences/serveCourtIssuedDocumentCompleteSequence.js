import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToPrintPaperServiceAction } from '../actions/navigateToPrintPaperServiceAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setDocumentToDisplayFromDocumentIdAction } from '../actions/setDocumentToDisplayFromDocumentIdAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const serveCourtIssuedDocumentCompleteSequence = [
  setPdfPreviewUrlAction,
  setAlertSuccessAction,
  clearModalAction,
  setSaveAlertsForNavigationAction,
  unsetWaitingForResponseAction,
  isPrintPreviewPreparedAction,
  {
    no: [
      followRedirectAction,
      {
        default: navigateToCaseDetailAction,
        success: [setDocumentToDisplayFromDocumentIdAction],
      },
    ],
    yes: [navigateToPrintPaperServiceAction],
  },
];
