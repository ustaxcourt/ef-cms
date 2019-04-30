import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearUserAction } from '../actions/clearUserAction';
import { redirectToIdleLogoutAction } from '../actions/redirectToIdleLogoutAction';

import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const gotoIdleLogoutSequence = [
  clearAlertsAction,
  clearModalAction,
  clearUserAction,
  set(state.shouldIdleLogout, false),
  redirectToIdleLogoutAction,
];
