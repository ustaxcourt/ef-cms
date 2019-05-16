import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { clearSessionMetadataAction } from '../actions/clearSessionMetadataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoLoginSequence = [
  clearAlertsAction,
  clearLoginFormAction,
  clearSessionMetadataAction,
  setCurrentPageAction('LogIn'),
];
