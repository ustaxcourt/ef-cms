import { clearFormsAction } from '../actions/clearFormsAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultFormDocumentForPreviewAction } from '../actions/setDefaultFormDocumentForPreviewAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentForPreviewSequence } from '../sequences/setDocumentForPreviewSequence';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';
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
  setDocumentForPreviewSequence,
  setCurrentPageAction('PetitionQc'),
];
