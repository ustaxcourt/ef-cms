import { getMaintenanceModeForPublicAction } from '../actions/getMaintenanceModeForPublicAction';
import { gotoMaintenanceSequence } from '../sequences/gotoMaintenanceSequence';

export const showMaintenancePageDecorator = actionsList => {
  const wrappedActions = [
    getMaintenanceModeForPublicAction,
    {
      maintenanceOff: [...actionsList],
      maintenanceOn: [gotoMaintenanceSequence],
    },
  ];

  return wrappedActions;
};
