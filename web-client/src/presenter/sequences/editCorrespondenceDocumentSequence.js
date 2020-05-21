import { chooseByTruthyStateActionFactory } from '../actions/editUploadCourtIssuedDocument/chooseByTruthyStateActionFactory';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getUploadCorrespondenceDocumentAlertSuccessAction } from '../actions/UploadCorrespondenceDocument/getUploadCorrespondenceDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { overwriteCorrespondenceFileAction } from '../actions/CourtIssuedOrder/overwriteCorrespondenceFileAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabAction } from '../actions/setCaseDetailPageTabAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setPrimaryDocumentFileIdPropAction } from '../actions/editUploadCourtIssuedDocument/setPrimaryDocumentFileIdPropAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupUploadMetadataAction } from '../actions/UploadCorrespondenceDocument/setupUploadMetadataAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCorrespondenceAction } from '../actions/UploadCorrespondenceDocument/submitCorrespondenceAction';
import { unsetDocumentToEditAction } from '../actions/editUploadCourtIssuedDocument/unsetDocumentToEditAction';
import { validateUploadCorrespondenceDocumentAction } from '../actions/UploadCorrespondenceDocument/validateUploadCorrespondenceDocumentAction';

const onError = [openFileUploadErrorModal];
const onSuccess = [
  setupUploadMetadataAction,
  submitCorrespondenceAction,
  setCaseAction,
  getUploadCorrespondenceDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  setCaseDetailPageTabAction,
  setCaseDetailPageTabFrozenAction,
  navigateToCaseDetailAction,
];

export const editCorrespondenceDocumentSequence = [
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
      chooseByTruthyStateActionFactory('screenMetadata.documentReset'),
      {
        no: [setPrimaryDocumentFileIdPropAction, onSuccess],
        yes: [
          overwriteCorrespondenceFileAction,
          {
            error: onError,
            success: onSuccess,
          },
        ],
      },
      unsetDocumentToEditAction,
    ]),
  },
];
