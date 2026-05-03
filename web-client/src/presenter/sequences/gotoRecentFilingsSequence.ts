import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { setDefaultRecentFilingsTableSortAction } from '../actions/setRecentFilingsTableSortAction';
import { loadRecentFilingsSequence } from './loadRecentFilingsSequence';

export const gotoRecentFilingsSequence =
  startWebSocketConnectionSequenceDecorator([
    clearAlertsAction,
    clearScreenMetadataAction,
    setDefaultRecentFilingsTableSortAction,
    loadRecentFilingsSequence,
    setupCurrentPageAction('RecentFilings'),
  ]);
