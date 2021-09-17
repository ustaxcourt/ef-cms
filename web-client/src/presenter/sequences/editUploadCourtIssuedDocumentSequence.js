import { chooseByTruthyStateActionFactory } from '../actions/EditUploadCourtIssuedDocument/chooseByTruthyStateActionFactory';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getUploadCourtIssuedDocumentAlertSuccessAction } from '../actions/UploadCourtIssuedDocument/getUploadCourtIssuedDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setDefaultDraftDocumentIdAction } from '../actions/setDefaultDraftDocumentIdAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { setPrimaryDocumentFileIdPropAction } from '../actions/EditUploadCourtIssuedDocument/setPrimaryDocumentFileIdPropAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupUploadMetadataAction } from '../actions/UploadCourtIssuedDocument/setupUploadMetadataAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetDocumentToEditAction } from '../actions/EditUploadCourtIssuedDocument/unsetDocumentToEditAction';
import { validateUploadCourtIssuedDocumentAction } from '../actions/UploadCourtIssuedDocument/validateUploadCourtIssuedDocumentAction';

const onError = [openFileUploadErrorModal];
const onSuccess = [
  generateCourtIssuedDocumentTitleAction,
  setupUploadMetadataAction,
  submitCourtIssuedOrderAction,
  setDefaultDraftDocumentIdAction,
  setCaseAction,
  getUploadCourtIssuedDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  setCaseDetailPageTabActionGenerator(),
  setIsPrimaryTabAction,
  setCaseDetailPageTabFrozenAction,
  followRedirectAction,
  {
    default: [navigateToCaseDetailAction],
    success: [],
  },
];

export const editUploadCourtIssuedDocumentSequence = [
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
      chooseByTruthyStateActionFactory('screenMetadata.documentReset'),
      {
        no: [setPrimaryDocumentFileIdPropAction, onSuccess],
        yes: [
          overwriteOrderFileAction,
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
