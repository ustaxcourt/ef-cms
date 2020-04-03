import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';

export const gotoPractitionerDetailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      setCurrentPageAction('Interstitial'),
      clearErrorAlertsAction,
      getPractitionerDetailAction,
      setPractitionerDetailAction,
      setCurrentPageAction('PractitionerDetail'),
    ],
    unauthorized: [redirectToCognitoAction],
  },
];
