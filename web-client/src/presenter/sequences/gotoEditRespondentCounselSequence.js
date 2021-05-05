import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setRespondentCounselFormAction } from '../actions/caseAssociation/setRespondentCounselFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditRespondentCounselSequence = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  getCaseAction,
  setCaseAction,
  setRespondentCounselFormAction,
  setCurrentPageAction('EditRespondentCounsel'),
];
