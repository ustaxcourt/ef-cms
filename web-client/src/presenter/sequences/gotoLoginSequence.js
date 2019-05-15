import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCurrentPageHeaderAction } from '../actions/clearCurrentPageHeaderAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { clearSessionMetadataAction } from '../actions/clearSessionMetadataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoLoginSequence = [
  clearAlertsAction,
  clearLoginFormAction,
  clearSessionMetadataAction,
  clearCurrentPageHeaderAction,
  setCurrentPageAction('LogIn'),
];
