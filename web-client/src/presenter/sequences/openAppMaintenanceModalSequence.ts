import { setMaintenanceModeAction } from '../actions/setMaintenanceModeAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAppMaintenanceModalSequence = [
  setMaintenanceModeAction,
  setShowModalFactoryAction('AppMaintenanceModal'),
];
