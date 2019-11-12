import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchPendingItemsSequence } from './pending/fetchPendingItemsSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

const gotoPendingReport = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  clearFormAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  fetchPendingItemsSequence,
  set(state.screenMetadata.sort, 'date'),
  set(state.screenMetadata.sortOrder, 'asc'),
  setCurrentPageAction('PendingReport'),
];

export const gotoPendingReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoPendingReport,
    unauthorized: [redirectToCognitoAction],
  },
];
