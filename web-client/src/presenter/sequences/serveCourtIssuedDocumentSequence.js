import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { isEditingDocketEntryAction } from '../actions/CourtIssuedDocketEntry/isEditingDocketEntryAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { serveCourtIssuedDocumentAction } from '../actions/serveCourtIssuedDocumentAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/submitCourtIssuedDocketEntryAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/updateCourtIssuedDocketEntryAction';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const serveCourtIssuedDocumentSequence = [
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
    success: [
      stopShowValidationAction,
      clearAlertsAction,
      setWaitingForResponseAction,
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
      navigateToCaseDetailAction,
      unsetWaitingForResponseAction,
    ],
  },
];
