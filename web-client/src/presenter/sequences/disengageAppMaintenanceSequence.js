import { clearModalSequence } from './clearModalSequence';
import { getUserAction } from '../actions/getUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { isTokenOnStateAction } from '../actions/isTokenOnStateAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { navigateToPathSequence } from './navigateToPathSequence';
import { setMaintenanceModeAction } from '../actions/setMaintenanceModeAction';
import { setUserAction } from '../actions/setUserAction';

export const disengageAppMaintenanceSequence = [
  isTokenOnStateAction,
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
