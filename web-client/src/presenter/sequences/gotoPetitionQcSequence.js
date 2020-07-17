import { clearFormsAction } from '../actions/clearFormsAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getFormDocumentUrlForPreviewAction } from '../actions/getFormDocumentUrlForPreviewAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultFormDocumentForPreviewAction } from '../actions/setDefaultFormDocumentForPreviewAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoPetitionQcSequence = [
  setCurrentPageAction('Interstitial'),
  clearFormsAction,
  setRedirectUrlAction,
  stopShowValidationAction,
  setDocumentDetailTabAction,
  getCaseAction,
  setCaseAction,
  setCaseOnFormAction,
  setFormForCaseAction,
  setDefaultFormDocumentForPreviewAction,
  getFormDocumentUrlForPreviewAction,
  setPdfPreviewUrlAction,
  setCurrentPageAction('PetitionQc'),
];
