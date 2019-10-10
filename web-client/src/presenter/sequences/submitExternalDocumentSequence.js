import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { fileExternalDocumentAction } from '../actions/FileDocument/fileExternalDocumentAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { getPrintableFilingReceiptSequence } from './getPrintableFilingReceiptSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';

export const submitExternalDocumentSequence = [
  openFileUploadStatusModalAction,
  fileExternalDocumentAction,
  {
    error: [openFileUploadErrorModal],
    success: [
      setCaseAction,
      ...getPrintableFilingReceiptSequence,
      getFileExternalDocumentAlertSuccessAction,
      closeFileUploadStatusModalAction,
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      navigateToCaseDetailAction,
    ],
  },
];
