import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setupContactPrimaryFormAction } from '../actions/setupContactPrimaryFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoPrimaryContactEdit = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setupContactPrimaryFormAction,
  setCurrentPageAction('PrimaryContactEdit'),
];

export const gotoPrimaryContactEditSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoPrimaryContactEdit,
    unauthorized: [redirectToCognitoAction],
  },
];
