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

export const uploadCourtIssuedDocument = (
  lastAction = navigateToCaseDetailAction,
) => [
  generateTitleAction,
  uploadOrderFileAction,
  {
    error: [openFileUploadErrorModal],
    success: [
      submitCourtIssuedOrderAction,
      setCaseAction,
      getFileExternalDocumentAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      lastAction,
    ],
  },
];

export const uploadCourtIssuedDocumentSequence = [
  setWaitingForResponseAction,
  uploadCourtIssuedDocument(),
  unsetWaitingForResponseAction,
];
