import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPendingReportsAction } from '../actions/PendingItems/clearPendingReportsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPendingReportSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    clearScreenMetadataAction,
    clearFormAction,
    closeMobileMenuAction,
    clearErrorAlertsAction,
    clearPendingReportsAction,
    getSetJudgesSequence,
    setupCurrentPageAction('PendingReport'),
  ]);
