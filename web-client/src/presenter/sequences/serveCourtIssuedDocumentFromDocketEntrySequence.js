import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { computeJudgeNameWithTitleAction } from '../actions/computeJudgeNameWithTitleAction';
import { fileAndServeCourtIssuedDocumentAction } from '../actions/CourtIssuedDocketEntry/fileAndServeCourtIssuedDocumentAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToPrintPaperServiceAction } from '../actions/navigateToPrintPaperServiceAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
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
      computeJudgeNameWithTitleAction,
      getComputedFormDateFactoryAction(null),
      generateCourtIssuedDocumentTitleAction,
      fileAndServeCourtIssuedDocumentAction,
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
