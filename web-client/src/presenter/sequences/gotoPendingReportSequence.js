import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchPendingItemsSequence } from './pending/fetchPendingItemsSequence';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const gotoPendingReport = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  clearFormAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  parallel([
    fetchUserNotificationsSequence,
    getSetJudgesSequence,
    fetchPendingItemsSequence,
  ]),
  setCurrentPageAction('PendingReport'),
];

export const gotoPendingReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoPendingReport,
    unauthorized: [redirectToCognitoAction],
  },
];
