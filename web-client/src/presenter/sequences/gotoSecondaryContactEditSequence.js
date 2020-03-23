import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setupContactSecondaryFormAction } from '../actions/setupContactSecondaryFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoSecondaryContactEdit = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setupContactSecondaryFormAction,
  setCurrentPageAction('SecondaryContactEdit'),
];

export const gotoSecondaryContactEditSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoSecondaryContactEdit,
    unauthorized: [redirectToCognitoAction],
  },
];
