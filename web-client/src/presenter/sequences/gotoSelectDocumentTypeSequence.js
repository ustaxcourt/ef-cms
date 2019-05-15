import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCurrentPageHeaderAction } from '../actions/clearCurrentPageHeaderAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const gotoSelectDocumentType = [
  setCurrentPageAction('Interstitial'),
  clearCurrentPageHeaderAction,
  clearAlertsAction,
  getCaseAction,
  setCaseAction,
  setCurrentPageAction('SelectDocumentType'),
];

export const gotoSelectDocumentTypeSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoSelectDocumentType,
    unauthorized: [redirectToCognitoAction],
  },
];
