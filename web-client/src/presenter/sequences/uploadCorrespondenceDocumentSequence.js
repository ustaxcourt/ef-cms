import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getUploadCorrespondenceDocumentAlertSuccessAction } from '../actions/UploadCorrespondenceDocument/getUploadCorrespondenceDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabAction } from '../actions/setCaseDetailPageTabAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setDocumentTitleFromFormAction } from '../actions/UploadCorrespondenceDocument/setDocumentTitleFromFormAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCorrespondenceAction } from '../actions/UploadCorrespondenceDocument/submitCorrespondenceAction';
import { uploadCorrespondenceFileAction } from '../actions/UploadCorrespondenceDocument/uploadCorrespondenceFileAction';
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
      uploadCorrespondenceFileAction,
      {
        error: [openFileUploadErrorModal],
        success: [
          setDocumentTitleFromFormAction,
          submitCorrespondenceAction,
          setCaseAction,
          getUploadCorrespondenceDocumentAlertSuccessAction,
          setAlertSuccessAction,
          setSaveAlertsForNavigationAction,
          setCaseDetailPageTabAction,
          setCaseDetailPageTabFrozenAction,
          navigateToCaseDetailAction,
        ],
      },
    ]),
  },
];
