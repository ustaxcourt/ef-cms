import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPendingReportsAction } from '../actions/PendingItems/clearPendingReportsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Public/goToLoginSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoPendingReport = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  clearFormAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  clearPendingReportsAction,
  getSetJudgesSequence,
  setupCurrentPageAction('PendingReport'),
]);

export const gotoPendingReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoPendingReport,
    unauthorized: [gotoLoginSequence],
  },
];
