import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { clearSessionMetadataAction } from '../actions/clearSessionMetadataAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoLoginSequence = [
  clearLoginFormAction,
  clearSessionMetadataAction,
  setupCurrentPageAction('LogIn'),
];
