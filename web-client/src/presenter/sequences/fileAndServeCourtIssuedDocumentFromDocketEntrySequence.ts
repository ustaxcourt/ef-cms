import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { computeJudgeNameWithTitleAction } from '../actions/computeJudgeNameWithTitleAction';
import { fileAndServeCourtIssuedDocumentAction } from '../actions/CourtIssuedDocketEntry/fileAndServeCourtIssuedDocumentAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getDocketNumbersForConsolidatedServiceAction } from '../actions/getDocketNumbersForConsolidatedServiceAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const fileAndServeCourtIssuedDocumentFromDocketEntrySequence = [
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
      setWaitingForResponseAction,
      stopShowValidationAction,
      clearAlertsAction,
      computeJudgeNameWithTitleAction,
      generateCourtIssuedDocumentTitleAction,
      getDocketNumbersForConsolidatedServiceAction,
      fileAndServeCourtIssuedDocumentAction,
    ],
  },
];
