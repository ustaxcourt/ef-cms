import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToPrintPaperServiceAction } from '../actions/navigateToPrintPaperServiceAction';
import { serveCourtIssuedDocumentAction } from '../actions/serveCourtIssuedDocumentAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentToDisplayFromDocumentIdAction } from '../actions/setDocumentToDisplayFromDocumentIdAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const serveCourtIssuedDocumentSequence = showProgressSequenceDecorator([
  serveCourtIssuedDocumentAction,
  setPdfPreviewUrlAction,
  setAlertSuccessAction,
  clearModalAction,
  setSaveAlertsForNavigationAction,
  isPrintPreviewPreparedAction,
  {
    no: [
      getCaseAction,
      setCaseAction,
      followRedirectAction,
      {
        default: navigateToCaseDetailAction,
        success: [setDocumentToDisplayFromDocumentIdAction],
      },
    ],
    yes: [navigateToPrintPaperServiceAction],
  },
]);
