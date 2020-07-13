import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getUploadCorrespondenceDocumentAlertSuccessAction } from '../actions/CorrespondenceDocument/getUploadCorrespondenceDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setDocumentTitleFromFormAction } from '../actions/CorrespondenceDocument/setDocumentTitleFromFormAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCorrespondenceAction } from '../actions/CorrespondenceDocument/submitCorrespondenceAction';
import { uploadCorrespondenceFileAction } from '../actions/CorrespondenceDocument/uploadCorrespondenceFileAction';
import { validateUploadCorrespondenceDocumentAction } from '../actions/CorrespondenceDocument/validateUploadCorrespondenceDocumentAction';

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
          setCaseDetailPageTabActionGenerator(),
          setCaseDetailPageTabFrozenAction,
          navigateToCaseDetailAction,
        ],
      },
    ]),
  },
];
