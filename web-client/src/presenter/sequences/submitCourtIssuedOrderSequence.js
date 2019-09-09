import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { getDocumentDetailParamsAction } from '../actions/getDocumentDetailParamsAction';
import { getEditDocumentEntryPointAction } from '../actions/getEditDocumentEntryPointAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { isFormPristineAction } from '../actions/CourtIssuedOrder/isFormPristineAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToDocumentDetailAction } from '../actions/navigateToDocumentDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { state } from 'cerebral';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';

export const submitCourtIssuedOrderSequence = [
  setFormSubmittingAction,
  isFormPristineAction,
  {
    no: [...convertHtml2PdfSequence],
    yes: [],
  },
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
      getDocumentDetailParamsAction,
      getEditDocumentEntryPointAction,
      {
        CaseDetail: navigateToCaseDetailAction,
        DocumentDetail: navigateToDocumentDetailAction,
      },
    ],
  },
  unsetFormSubmittingAction,
];
