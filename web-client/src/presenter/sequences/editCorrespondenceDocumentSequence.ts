import { chooseByTruthyStateActionFactory } from '../actions/EditUploadCourtIssuedDocument/chooseByTruthyStateActionFactory';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getEditCorrespondenceDocumentAlertSuccessAction } from '../actions/CorrespondenceDocument/getEditCorrespondenceDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { overwriteCorrespondenceFileAction } from '../actions/CourtIssuedOrder/overwriteCorrespondenceFileAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setDocumentTitleFromFormAction } from '../actions/CorrespondenceDocument/setDocumentTitleFromFormAction';
import { setPrimaryCorrespondenceFileIdPropAction } from '../actions/CorrespondenceDocument/setPrimaryCorrespondenceFileIdPropAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCorrespondenceAction } from '../actions/CorrespondenceDocument/submitCorrespondenceAction';
import { unsetDocumentToEditAction } from '../actions/EditUploadCourtIssuedDocument/unsetDocumentToEditAction';
import { validateUploadCorrespondenceDocumentAction } from '../actions/CorrespondenceDocument/validateUploadCorrespondenceDocumentAction';

const onError = [openFileUploadErrorModal];
const onSuccess = [
  setDocumentTitleFromFormAction,
  submitCorrespondenceAction,
  setCaseAction,
  getEditCorrespondenceDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  setCaseDetailPageTabActionGenerator(),
  setCaseDetailPageTabFrozenAction,
  followRedirectAction,
  {
    default: [navigateToCaseDetailAction],
    success: [],
  },
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
        no: [setPrimaryCorrespondenceFileIdPropAction, onSuccess],
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
