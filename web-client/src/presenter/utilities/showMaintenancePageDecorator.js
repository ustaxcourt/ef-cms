import { getMaintenanceModeAction } from '../actions/getMaintenanceModeAction';
import { gotoMaintenanceSequence } from '../sequences/gotoMaintenanceSequence';

export const showMaintenancePageDecorator = actionsList => {
  const wrappedActions = [
    getMaintenanceModeAction,
    {
      maintenanceOff: [...actionsList],
      maintenanceOn: [gotoMaintenanceSequence],
    },
  ];

  return wrappedActions;
};
