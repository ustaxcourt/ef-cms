import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

const gotoAddTrialSession = [
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearAlertsAction,
  clearFormAction,
  clearScreenMetadataAction,
  setCurrentPageAction('AddTrialSession'),
];

export const gotoAddTrialSessionSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoAddTrialSession,
    unauthorized: [redirectToCognitoAction],
  },
];
