import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setupContactFormAction } from '../actions/setupContactFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoContactEdit = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setupContactFormAction,
  setCurrentPageAction('ContactEdit'),
];

export const gotoContactEditSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoContactEdit,
    unauthorized: [redirectToCognitoAction],
  },
];
