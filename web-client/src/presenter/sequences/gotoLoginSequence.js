import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { clearSessionMetadataAction } from '../actions/clearSessionMetadataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoLoginSequence = [
  clearLoginFormAction,
  clearSessionMetadataAction,
  setCurrentPageAction('LogIn'),
];
