import { clearModalSequence } from './clearModalSequence';
import { getUserAction } from '../actions/getUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { isTokenOnState } from '../actions/isTokenOnState';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { navigateToPathSequence } from './navigateToPathSequence';
import { setMaintenanceModeAction } from '../actions/setMaintenanceModeAction';
import { setUserAction } from '../actions/setUserAction';

export const disengageAppMaintenanceSequence = [
  isTokenOnState,
  {
    no: [],
    yes: [getUserAction, setUserAction],
  },
  isLoggedInAction,
  {
    isLoggedIn: [
      clearModalSequence,
      setMaintenanceModeAction,
      navigateToPathSequence,
    ],
    unauthorized: [navigateToPathAction],
  },
];
