import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { state } from 'cerebral';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder//submitCourtIssuedOrderAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';

export const submitCourtIssuedOrderSequence = [
  openFileUploadStatusModalAction,
  uploadExternalDocumentsAction,
  {
    error: [openFileUploadErrorModal],
    success: [
      submitCourtIssuedOrderAction,
      setCaseAction,
      closeFileUploadStatusModalAction,
      getFileExternalDocumentAlertSuccessAction,
      setAlertSuccessAction,
      set(state.saveAlertsForNavigation, true),
      navigateToCaseDetailAction,
    ],
  },
];
