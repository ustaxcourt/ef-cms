import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { getEditDocumentEntryPointAction } from '../actions/getEditDocumentEntryPointAction';
import { getEditedDocumentDetailParamsAction } from '../actions/getEditedDocumentDetailParamsAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { isEditingOrderAction } from '../actions/CourtIssuedOrder/isEditingOrderAction';
import { isFormPristineAction } from '../actions/CourtIssuedOrder/isFormPristineAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToDocumentDetailAction } from '../actions/navigateToDocumentDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { uploadOrderFileAction } from '../actions/FileDocument/uploadOrderFileAction';

const onFileUploadedSuccess = [
  setWaitingForResponseAction,
  submitCourtIssuedOrderAction,
  setCaseAction,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  getEditedDocumentDetailParamsAction,
  getEditDocumentEntryPointAction,
  {
    CaseDetail: navigateToCaseDetailAction,
    DocumentDetail: navigateToDocumentDetailAction,
  },
  unsetWaitingForResponseAction,
];

export const submitCourtIssuedOrderSequence = [
  setWaitingForResponseAction,
  isFormPristineAction,
  {
    no: [...convertHtml2PdfSequence],
    yes: [],
  },
  isEditingOrderAction,
  {
    no: [
      uploadOrderFileAction,
      {
        error: [openFileUploadErrorModal],
        success: onFileUploadedSuccess,
      },
    ],
    yes: [
      overwriteOrderFileAction,
      {
        error: [openFileUploadErrorModal],
        success: onFileUploadedSuccess,
      },
    ],
  },
  unsetWaitingForResponseAction,
];
