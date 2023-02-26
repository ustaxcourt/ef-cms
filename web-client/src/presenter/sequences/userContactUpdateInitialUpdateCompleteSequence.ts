import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const userContactUpdateInitialUpdateCompleteSequence = [
  unsetWaitingForResponseAction,
  navigateToDashboardAction,
];
