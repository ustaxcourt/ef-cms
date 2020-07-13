import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getEditDocumentEntryPointAction } from '../actions/getEditDocumentEntryPointAction';
import { getEditedDocumentDetailParamsAction } from '../actions/getEditedDocumentDetailParamsAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { getShouldRedirectToSigningAction } from '../actions/getShouldRedirectToSigningAction';
import { isEditingOrderAction } from '../actions/CourtIssuedOrder/isEditingOrderAction';
import { isFormPristineAction } from '../actions/CourtIssuedOrder/isFormPristineAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToDocumentDetailAction } from '../actions/navigateToDocumentDetailAction';
import { navigateToSignOrderAction } from '../actions/navigateToSignOrderAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { uploadOrderFileAction } from '../actions/FileDocument/uploadOrderFileAction';

const onFileUploadedSuccess = [
  submitCourtIssuedOrderAction,
  setCaseAction,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  getEditedDocumentDetailParamsAction,
  getShouldRedirectToSigningAction,
  {
    no: [
      followRedirectAction,
      {
        default: [
          getEditDocumentEntryPointAction,
          {
            CaseDetail: navigateToCaseDetailAction,
            DocumentDetail: navigateToDocumentDetailAction,
          },
        ],
        success: [],
      },
    ],
    yes: navigateToSignOrderAction,
  },
];

export const submitCourtIssuedOrderSequence = showProgressSequenceDecorator([
  isFormPristineAction,
  {
    no: convertHtml2PdfSequence,
    yes: [],
  },
  isEditingOrderAction,
  {
    no: [
      uploadOrderFileAction,
      {
        error: [openFileUploadErrorModal],
        success: [onFileUploadedSuccess],
      },
    ],
    yes: [
      overwriteOrderFileAction,
      {
        error: [openFileUploadErrorModal],
        success: [onFileUploadedSuccess],
      },
    ],
  },
]);
