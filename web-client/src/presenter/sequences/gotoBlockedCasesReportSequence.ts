import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoBlockedCasesReport = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  clearFormAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  setupCurrentPageAction('BlockedCasesReport'),
]);

export const gotoBlockedCasesReportSequence = [gotoBlockedCasesReport];
