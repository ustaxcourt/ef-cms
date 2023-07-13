import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoMaintenanceSequence =
  startWebSocketConnectionSequenceDecorator([
    clearAlertsAction,
    clearScreenMetadataAction,
    setCurrentPageAction('AppMaintenance'),
  ]);
