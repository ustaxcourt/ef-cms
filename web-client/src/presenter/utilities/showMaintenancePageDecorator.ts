import { getAllFeatureFlagsAction } from '../actions/getAllFeatureFlagsAction';
import { getMaintenanceModeForPublicAction } from '../actions/getMaintenanceModeForPublicAction';
import { gotoMaintenanceSequence } from '../sequences/gotoMaintenanceSequence';

export const showMaintenancePageDecorator = (actionsList): any[] => {
  const wrappedActions = [
    getMaintenanceModeForPublicAction,
    {
      maintenanceOff: [getAllFeatureFlagsAction, ...actionsList],
      maintenanceOn: [gotoMaintenanceSequence],
    },
  ];

  return wrappedActions;
};
