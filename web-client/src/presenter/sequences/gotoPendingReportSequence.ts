import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPendingReportsAction } from '../actions/PendingItems/clearPendingReportsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { setDefaultPendingReportTableSortAction } from '@web-client/presenter/actions/PendingItems/setDefaultPendingReportTableSortAction';

export const gotoPendingReportSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    clearScreenMetadataAction,
    clearFormAction,
    closeMobileMenuAction,
    clearErrorAlertsAction,
    clearPendingReportsAction,
    getSetJudgesSequence,
    setDefaultPendingReportTableSortAction,
    setupCurrentPageAction('PendingReport'),
  ]);
