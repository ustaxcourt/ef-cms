import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { isEditingDocketEntryAction } from '../actions/CourtIssuedDocketEntry/isEditingDocketEntryAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToPrintPaperServiceAction } from '../actions/navigateToPrintPaperServiceAction';
import { serveCourtIssuedDocumentAction } from '../actions/serveCourtIssuedDocumentAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/submitCourtIssuedDocketEntryAction';
import { updateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/updateCourtIssuedDocketEntryAction';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const serveCourtIssuedDocumentFromDocketEntrySequence = [
  clearAlertsAction,
  clearPdfPreviewUrlAction,
  startShowValidationAction,
  validateCourtIssuedDocketEntryAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
      clearModalAction,
    ],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      isEditingDocketEntryAction,
      {
        no: [submitCourtIssuedDocketEntryAction],
        yes: [updateCourtIssuedDocketEntryAction],
      },
      serveCourtIssuedDocumentAction,
      setPdfPreviewUrlAction,
      setAlertSuccessAction,
      clearModalAction,
      setSaveAlertsForNavigationAction,
      isPrintPreviewPreparedAction,
      {
        no: [
          followRedirectAction,
          {
            default: navigateToCaseDetailAction,
            success: [],
          },
        ],
        yes: [navigateToPrintPaperServiceAction],
      },
    ]),
  },
];
