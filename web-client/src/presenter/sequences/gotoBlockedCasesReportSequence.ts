import { clearBlockedCasesReportAction } from '@web-client/presenter/actions/Reports/BlockedCaseReport/clearBlockedCasesReportAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoBlockedCasesReportSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    clearScreenMetadataAction,
    clearFormAction,
    clearBlockedCasesReportAction,
    closeMobileMenuAction,
    clearErrorAlertsAction,
    setupCurrentPageAction('BlockedCasesReport'),
  ]);
