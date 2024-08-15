import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDocumentContentsAction } from '../actions/getDocumentContentsAction';
import { getDocumentEditUrlAsPathAction } from '../actions/getDocumentEditUrlAsPathAction';
import { isStatusReportOrderAction } from '@web-client/presenter/actions/StatusReportOrder/isStatusReportOrderAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { removeSignatureAction } from '../actions/removeSignatureAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setEditStatusReportOrderFormAction } from '@web-client/presenter/actions/StatusReportOrder/setEditStatusReportOrderFormAction';
import { setFormFromDraftStateAction } from '../actions/setFormFromDraftStateAction';
import { setupConfirmWithPropsAction } from '../actions/setupConfirmWithPropsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { statusReportOrderPdfPreviewSequence } from '@web-client/presenter/sequences/StatusReportOrder/statusReportOrderPdfPreviewSequence';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocumentToEditAction } from '../actions/unsetDocumentToEditAction';

export const navigateToEditOrderSequence = [
  setupConfirmWithPropsAction,
  unsetDocumentToEditAction,
  clearModalAction,
  setupCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  getCaseAction,
  setCaseAction,
  getDocumentContentsAction,
  setFormFromDraftStateAction,
  setDocumentToEditAction,
  removeSignatureAction,
  isStatusReportOrderAction,
  {
    isNotStatusReportOrder: [
      getDocumentEditUrlAsPathAction,
      navigateToPathAction,
    ],
    isStatusReportOrder: [
      setEditStatusReportOrderFormAction,
      navigateToPathAction,
      statusReportOrderPdfPreviewSequence,
    ],
  },
] as unknown as () => void;
