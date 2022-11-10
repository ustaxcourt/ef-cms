import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getUploadCourtIssuedDocumentAlertSuccessAction } from '../actions/UploadCourtIssuedDocument/getUploadCourtIssuedDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setDefaultDraftDocumentIdAction } from '../actions/setDefaultDraftDocumentIdAction';
import { setDocumentTitleFromFreeTextAction } from '../actions/UploadCourtIssuedDocument/setDocumentTitleFromFreeTextAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { uploadOrderFileAction } from '../actions/FileDocument/uploadOrderFileAction';
import { validateUploadCourtIssuedDocumentAction } from '../actions/UploadCourtIssuedDocument/validateUploadCourtIssuedDocumentAction';

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
          setDocumentTitleFromFreeTextAction,
          submitCourtIssuedOrderAction,
          setDefaultDraftDocumentIdAction,
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
