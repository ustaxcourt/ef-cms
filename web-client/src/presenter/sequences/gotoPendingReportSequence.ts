import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPendingReportsAction } from '../actions/PendingItems/clearPendingReportsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoPendingReport = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  clearFormAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  clearPendingReportsAction,
  parallel([fetchUserNotificationsSequence, getSetJudgesSequence]),
  setupCurrentPageAction('PendingReport'),
]);

export const gotoPendingReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoPendingReport,
    unauthorized: [redirectToCognitoAction],
  },
];
