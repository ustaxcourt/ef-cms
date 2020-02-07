import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';

// TODO
const gotoSecondaryContactEdit = [
  setCurrentPageAction('Interstitial'),
  startShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setCurrentPageAction('PrimaryContactEdit'),
];

export const gotoSecondaryContactEditSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoSecondaryContactEdit,
    unauthorized: [redirectToCognitoAction],
  },
];
