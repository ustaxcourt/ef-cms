import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDocumentEditUrlAsPathAction } from '../actions/getDocumentEditUrlAsPathAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { removeSignatureAction } from '../actions/removeSignatureAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setFormFromDraftStateAction } from '../actions/setFormFromDraftStateAction';
import { setupConfirmWithPropsAction } from '../actions/setupConfirmWithPropsAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unset } from 'cerebral/factories';

export const navigateToEditOrderSequence = [
  setupConfirmWithPropsAction,
  unset(state.documentToEdit),
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  getCaseAction,
  setCaseAction,
  setFormFromDraftStateAction,
  setDocumentToEditAction,
  removeSignatureAction,
  getDocumentEditUrlAsPathAction,
  navigateToPathAction,
];
