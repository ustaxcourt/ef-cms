import { clearFormsAction } from '../actions/clearFormsAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDocumentUrlForPreviewAction } from '../actions/getDocumentUrlForPreviewAction';
import { newAction } from '../actions/newAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultFormDocumentForPreviewAction } from '../actions/setDefaultFormDocumentForPreviewAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
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
  newAction,
  getDocumentUrlForPreviewAction,
  setPdfPreviewUrlAction,
  setDocumentIdAction,
  setCurrentPageAction('PetitionQc'),
];
