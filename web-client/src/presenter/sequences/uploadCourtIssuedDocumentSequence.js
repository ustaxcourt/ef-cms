import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setupUploadMetadataAction } from '../actions/uploadCourtIssuedDocument/setupUploadMetadataAction';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { uploadOrderFileAction } from '../actions/FileDocument/uploadOrderFileAction';

export const uploadCourtIssuedDocument = (
  lastAction = navigateToCaseDetailAction,
) => [
  setWaitingForResponseAction,
  uploadOrderFileAction,
  {
    error: [openFileUploadErrorModal],
    success: [
      generateCourtIssuedDocumentTitleAction,
      setupUploadMetadataAction,
      submitCourtIssuedOrderAction,
      setCaseAction,
      getFileExternalDocumentAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      lastAction,
    ],
  },
  unsetWaitingForResponseAction,
];

export const uploadCourtIssuedDocumentSequence = [uploadCourtIssuedDocument()];
