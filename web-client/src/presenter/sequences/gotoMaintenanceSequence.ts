import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setCurrentPageMaintenanceAction } from '../actions/setCurrentPageMaintenanceAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoMaintenanceSequence =
  startWebSocketConnectionSequenceDecorator([
    clearAlertsAction,
    clearScreenMetadataAction,
    setCurrentPageMaintenanceAction,
  ]);
