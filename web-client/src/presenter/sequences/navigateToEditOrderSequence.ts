import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDocumentContentsAction } from '../actions/getDocumentContentsAction';
import { getDocumentEditUrlAsPathAction } from '../actions/getDocumentEditUrlAsPathAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { removeSignatureAction } from '../actions/removeSignatureAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setFormFromDraftStateAction } from '../actions/setFormFromDraftStateAction';
import { setupConfirmWithPropsAction } from '../actions/setupConfirmWithPropsAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocumentToEditAction } from '../actions/unsetDocumentToEditAction';

export const navigateToEditOrderSequence = [
  setupConfirmWithPropsAction,
  unsetDocumentToEditAction,
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  getCaseAction,
  setCaseAction,
  getDocumentContentsAction,
  setFormFromDraftStateAction,
  setDocumentToEditAction,
  removeSignatureAction,
  getDocumentEditUrlAsPathAction,
  navigateToPathAction,
];
