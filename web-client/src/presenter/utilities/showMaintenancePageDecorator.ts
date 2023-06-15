import { getAllFeatureFlagsAction } from '../actions/getAllFeatureFlagsAction';
import { getMaintenanceModeForPublicAction } from '../actions/getMaintenanceModeForPublicAction';
import { gotoMaintenanceSequence } from '../sequences/gotoMaintenanceSequence';

export const showMaintenancePageDecorator = actionsList => {
  const wrappedActions = [
    getMaintenanceModeForPublicAction,
    {
      maintenanceOff: [getAllFeatureFlagsAction, ...actionsList],
      maintenanceOn: [gotoMaintenanceSequence],
    },
  ];

  return wrappedActions;
};
