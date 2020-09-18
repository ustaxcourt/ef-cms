import { clearAlertsAction } from '../actions/clearAlertsAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getUploadCourtIssuedDocumentAlertSuccessAction } from '../actions/uploadCourtIssuedDocument/getUploadCourtIssuedDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupUploadMetadataAction } from '../actions/uploadCourtIssuedDocument/setupUploadMetadataAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { uploadOrderFileAction } from '../actions/FileDocument/uploadOrderFileAction';
import { validateUploadCourtIssuedDocumentAction } from '../actions/uploadCourtIssuedDocument/validateUploadCourtIssuedDocumentAction';

export const uploadCourtIssuedDocumentSequence = [
  startShowValidationAction,
  validateUploadCourtIssuedDocumentAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      uploadOrderFileAction,
      {
        error: [openFileUploadErrorModal],
        success: [
          generateCourtIssuedDocumentTitleAction,
          setupUploadMetadataAction,
          submitCourtIssuedOrderAction,
          setCaseAction,
          getUploadCourtIssuedDocumentAlertSuccessAction,
          setAlertSuccessAction,
          setSaveAlertsForNavigationAction,
          setCaseDetailPageTabActionGenerator(),
          setIsPrimaryTabAction,
          setCaseDetailPageTabFrozenAction,
          navigateToCaseDetailAction,
        ],
      },
    ]),
  },
];
