import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

const gotoBeforeYouFileDocument = [
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  getCaseAction,
  setCaseAction,
  setCurrentPageAction('BeforeYouFileADocument'),
];

export const gotoBeforeYouFileDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoBeforeYouFileDocument,
    unauthorized: [redirectToCognitoAction],
  },
];
