import { chooseByTruthyStateActionFactory } from '../actions/editUploadCourtIssuedDocument/chooseByTruthyStateActionFactory';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getUploadCourtIssuedDocumentAlertSuccessAction } from '../actions/uploadCourtIssuedDocument/getUploadCourtIssuedDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabAction } from '../actions/setCaseDetailPageTabAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { setPrimaryDocumentFileIdPropAction } from '../actions/editUploadCourtIssuedDocument/setPrimaryDocumentFileIdPropAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupUploadMetadataAction } from '../actions/uploadCourtIssuedDocument/setupUploadMetadataAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetDocumentToEditAction } from '../actions/editUploadCourtIssuedDocument/unsetDocumentToEditAction';
import { validateUploadCourtIssuedDocumentAction } from '../actions/uploadCourtIssuedDocument/validateUploadCourtIssuedDocumentAction';

const onError = [openFileUploadErrorModal];
const onSuccess = [
  generateCourtIssuedDocumentTitleAction,
  setupUploadMetadataAction,
  submitCourtIssuedOrderAction,
  setCaseAction,
  getUploadCourtIssuedDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  setCaseDetailPageTabAction,
  setIsPrimaryTabAction,
  setCaseDetailPageTabFrozenAction,
  navigateToCaseDetailAction,
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
