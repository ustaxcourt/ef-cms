import { clearFormsAction } from '../actions/clearFormsAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';

export const gotoEditSavedPetitionSequence = [
  clearFormsAction,
  setDocumentIdAction,
  getCaseAction,
  setCaseAction,
  setCaseOnFormAction,
  setFormForCaseAction,
  setDocumentDetailTabAction,
  setCurrentPageAction('DocumentDetail'),
];
