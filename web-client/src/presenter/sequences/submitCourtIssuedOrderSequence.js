import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { isFormPristineAction } from '../actions/CourtIssuedOrder/isFormPristineAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { state } from 'cerebral';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { uploadOrderFileAction } from '../actions/FileDocument/uploadOrderFileAction';

export const submitCourtIssuedOrderSequence = [
  setFormSubmittingAction,
  isFormPristineAction,
  {
    no: [...convertHtml2PdfSequence],
    yes: [],
  },
  uploadOrderFileAction,
  {
    error: [openFileUploadErrorModal],
    success: [
      submitCourtIssuedOrderAction,
      setCaseAction,
      getFileExternalDocumentAlertSuccessAction,
      setAlertSuccessAction,
      set(state.saveAlertsForNavigation, true),
      navigateToCaseDetailAction,
    ],
  },
  unsetFormSubmittingAction,
];
