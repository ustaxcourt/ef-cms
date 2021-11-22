import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createTokenAction } from '../actions/createTokenAction';
import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setTokenAction } from '../actions/setTokenAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';
import { setupConfigSequence } from './setupConfigSequence';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const submitLocalLoginSequence = showProgressSequenceDecorator([
  createTokenAction,
  decodeTokenAction,
  setTokenAction,
  getUserAction,
  setUserAction,
  setUserPermissionsAction,
  setupConfigSequence,
  clearAlertsAction,
  navigateToPathAction,
]);
