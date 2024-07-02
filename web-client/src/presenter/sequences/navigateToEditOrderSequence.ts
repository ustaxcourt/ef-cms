import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDocumentContentsAction } from '../actions/getDocumentContentsAction';
import { getDocumentEditUrlAsPathAction } from '../actions/getDocumentEditUrlAsPathAction';
import { isStatusReportOrderResponseAction } from '@web-client/presenter/actions/isStatusReportOrderResponseAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { navigateToStatusReportOrderResponseAction } from '@web-client/presenter/actions/navigateToStatusReportOrderResponseAction';
import { removeSignatureAction } from '../actions/removeSignatureAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setEditStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/setEditStatusReportOrderResponseFormAction';
import { setFormFromDraftStateAction } from '../actions/setFormFromDraftStateAction';
import { setupConfirmWithPropsAction } from '../actions/setupConfirmWithPropsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
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
  isStatusReportOrderResponseAction,
  {
    isNotStatusReportOrderResponse: [
      getDocumentEditUrlAsPathAction,
      navigateToPathAction,
    ],
    isStatusReportOrderResponse: [
      setEditStatusReportOrderResponseFormAction,
      navigateToStatusReportOrderResponseAction,
    ],
  },
];
