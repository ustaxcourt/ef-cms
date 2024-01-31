import { appendFormAndOverwriteOrderFileAction } from '../actions/CourtIssuedOrder/appendFormAndOverwriteOrderFileAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getEditedDocumentDetailParamsAction } from '../actions/getEditedDocumentDetailParamsAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { getShouldRedirectToSigningAction } from '../actions/getShouldRedirectToSigningAction';
import { isDocumentRequiringAppendedFormAction } from '../actions/CourtIssuedOrder/isDocumentRequiringAppendedFormAction';
import { isEditingOrderAction } from '../actions/CourtIssuedOrder/isEditingOrderAction';
import { navigateToDraftDocumentsAction } from '../actions/navigateToDraftDocumentsAction';
import { navigateToSignOrderAction } from '../actions/navigateToSignOrderAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDefaultDraftDocumentIdAction } from '../actions/setDefaultDraftDocumentIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetCreateOrderAddedDocketNumbers } from '@web-client/presenter/actions/unsetCreateOrderAddedDocketNumbers';
import { unsetCreateOrderSelectedCases } from '@web-client/presenter/actions/unsetCreateOrderSelectedCases';
import { uploadOrderFileAction } from '../actions/FileDocument/uploadOrderFileAction';

const onFileUploadedSuccess = [
  submitCourtIssuedOrderAction,
  setDefaultDraftDocumentIdAction,
  setCaseAction,
  setDefaultDraftDocumentIdAction,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  getEditedDocumentDetailParamsAction,
  unsetCreateOrderSelectedCases,
  unsetCreateOrderAddedDocketNumbers,
  getShouldRedirectToSigningAction,
  {
    no: [
      followRedirectAction,
      {
        default: [navigateToDraftDocumentsAction],
        success: [],
      },
    ],
    yes: navigateToSignOrderAction,
  },
];

export const submitCourtIssuedOrderSequence = showProgressSequenceDecorator([
  convertHtml2PdfSequence,
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
        success: [
          isDocumentRequiringAppendedFormAction,
          {
            no: [],
            yes: [appendFormAndOverwriteOrderFileAction],
          },
          onFileUploadedSuccess,
        ],
      },
    ],
  },
]);
