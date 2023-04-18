import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { getPrintableFilingReceiptSequence } from './getPrintableFilingReceiptSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitRespondentCaseAssociationRequestAction } from '../actions/FileDocument/submitRespondentCaseAssociationRequestAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';

const onSuccess = [
  submitRespondentCaseAssociationRequestAction,
  setCaseAction,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
  closeFileUploadStatusModalAction,
  getPrintableFilingReceiptSequence,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToCaseDetailAction,
];

export const submitExternalDocumentSequence = showProgressSequenceDecorator([
  openFileUploadStatusModalAction,
  uploadExternalDocumentsAction,
  {
    error: [openFileUploadErrorModal],
    success: onSuccess,
  },
]);
