import { clearAlertsAction } from '../actions/clearAlertsAction';
// import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
// import { getUploadCourtIssuedDocumentAlertSuccessAction } from '../actions/uploadCourtIssuedDocument/getUploadCourtIssuedDocumentAlertSuccessAction';
// import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
// import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
// import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
// import { setCaseAction } from '../actions/setCaseAction';
// import { setCaseDetailPageTabAction } from '../actions/setCaseDetailPageTabAction';
// import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
// import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
// import { setupUploadMetadataAction } from '../actions/uploadCourtIssuedDocument/setupUploadMetadataAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
// import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
// import { uploadCorrespondenceDocumentAction } from '../actions/uploadCorrespondenceDocumentAction/uploadCorrespondenceDocumentAction';
import { validateUploadCorrespondenceDocumentAction } from '../actions/UploadCorrespondenceDocument/validateUploadCorrespondenceDocumentAction';

export const uploadCorrespondenceDocumentSequence = [
  startShowValidationAction,
  validateUploadCorrespondenceDocumentAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      // uploadCorrespondenceDocumentAction,
      // {
      //   error: [openFileUploadErrorModal],
      //   success: [
      //     generateCourtIssuedDocumentTitleAction,
      //     setupUploadMetadataAction,
      //     submitCourtIssuedOrderAction,
      //     setCaseAction,
      //     getUploadCourtIssuedDocumentAlertSuccessAction,
      //     setAlertSuccessAction,
      //     setSaveAlertsForNavigationAction,
      //     setCaseDetailPageTabAction,
      //     setCaseDetailPageTabFrozenAction,
      //     navigateToCaseDetailAction,
      //   ],
      // },
    ]),
  },
];
