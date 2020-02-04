import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { uploadOrderFileAction } from '../actions/FileDocument/uploadOrderFileAction';

const onFileUploadedSuccess = [
  submitCourtIssuedOrderAction,
  setCaseAction,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToCaseDetailAction,
];

export const uploadCourtIssuedDocumentSequence = [
  generateTitleAction,
  setWaitingForResponseAction,
  uploadOrderFileAction,
  {
    error: [openFileUploadErrorModal],
    success: onFileUploadedSuccess,
  },
  unsetWaitingForResponseAction,
];
