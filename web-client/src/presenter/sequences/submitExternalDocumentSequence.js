import { canFileInConsolidatedCasesAction } from '../actions/FileDocument/canFileInConsolidatedCasesAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { getPrintableFilingReceiptSequence } from './getPrintableFilingReceiptSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitRespondentCaseAssociationRequestAction } from '../actions/FileDocument/submitRespondentCaseAssociationRequestAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';
import { uploadExternalDocumentsForConsolidatedAction } from '../actions/FileDocument/uploadExternalDocumentsForConsolidatedAction';

const onSuccess = [
  submitRespondentCaseAssociationRequestAction,
  setCaseAction,
  closeFileUploadStatusModalAction,
  setWaitingForResponseAction,
  getPrintableFilingReceiptSequence,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  unsetWaitingForResponseAction,
  navigateToCaseDetailAction,
];

export const submitExternalDocumentSequence = [
  openFileUploadStatusModalAction,
  canFileInConsolidatedCasesAction,
  {
    no: [
      uploadExternalDocumentsAction,
      {
        error: [openFileUploadErrorModal],
        success: onSuccess,
      },
    ],
    yes: [
      uploadExternalDocumentsForConsolidatedAction,
      {
        error: [openFileUploadErrorModal],
        success: onSuccess,
      },
    ],
  },
];
