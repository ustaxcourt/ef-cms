import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { clearUserAction } from '../actions/clearUserAction';
import navigateToCognito from '../actions/navigateToCognitoAction';

export default [
  clearAlertsAction,
  clearUserAction,
  clearLoginFormAction,
  navigateToCognito,
];
