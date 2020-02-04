import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const gotoBlockedCasesReport = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  clearFormAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  setCurrentPageAction('BlockedCasesReport'),
];

export const gotoBlockedCasesReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: parallel([
      fetchUserNotificationsSequence,
      gotoBlockedCasesReport,
    ]),
    unauthorized: [redirectToCognitoAction],
  },
];
