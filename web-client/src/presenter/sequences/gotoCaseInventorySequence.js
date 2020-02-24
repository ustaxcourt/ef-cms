import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getAllCaseDeadlinesAction } from '../actions/CaseDeadline/getAllCaseDeadlinesAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const gotoCaseInventory = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  getSetJudgesSequence,
  getAllCaseDeadlinesAction,
  setCurrentPageAction('CaseInventory'),
];

export const gotoCaseInventorySequence = [
  isLoggedInAction,
  {
    isLoggedIn: parallel([fetchUserNotificationsSequence, gotoCaseInventory]),
    unauthorized: [redirectToCognitoAction],
  },
];
