import { appendFormAndOverwriteOrderFileAction } from '../actions/CourtIssuedOrder/appendFormAndOverwriteOrderFileAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getCreateOrderSelectedCases } from '@web-client/presenter/actions/getCreateOrderSelectedCases';
import { getEditedDocumentDetailParamsAction } from '../actions/getEditedDocumentDetailParamsAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { getShouldRedirectToSigningAction } from '../actions/getShouldRedirectToSigningAction';
import { isDocumentRequiringAppendedFormAction } from '../actions/CourtIssuedOrder/isDocumentRequiringAppendedFormAction';
import { isEditingOrderAction } from '../actions/CourtIssuedOrder/isEditingOrderAction';
import { isStatusReportOrderAction } from '@web-client/presenter/actions/StatusReportOrder/isStatusReportOrderAction';
import { navigateToDraftDocumentsAction } from '../actions/navigateToDraftDocumentsAction';
import { navigateToSignOrderAction } from '../actions/navigateToSignOrderAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDefaultDraftDocumentIdAction } from '../actions/setDefaultDraftDocumentIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetCreateOrderAddedDocketNumbers } from '@web-client/presenter/actions/unsetCreateOrderAddedDocketNumbers';
import { unsetCreateOrderSelectedCases } from '@web-client/presenter/actions/unsetCreateOrderSelectedCases';
import { uploadOrderFileAction } from '../actions/FileDocument/uploadOrderFileAction';
import { validateCourtOrderAction } from '../actions/CourtIssuedOrder/validateCourtOrderAction';

const onFileUploadedSuccess = [
  getCreateOrderSelectedCases,
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

const submitCourtIssuedOrder = showProgressSequenceDecorator([
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

export const submitCourtIssuedOrderSequence = showProgressSequenceDecorator([
  isStatusReportOrderAction,
  {
    isNotStatusReportOrder: [
      clearAlertsAction,
      startShowValidationAction,
      validateCourtOrderAction,
      {
        error: [
          setValidationErrorsAction,
          setScrollToErrorNotificationAction,
          setValidationAlertErrorsAction,
        ],
        success: submitCourtIssuedOrder,
      },
    ],
    isStatusReportOrder: [submitCourtIssuedOrder],
  },
]);
