import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const adminContactUpdateInitialUpdateCompleteSequence = [
  unsetWaitingForResponseAction,
  navigateToPractitionerDetailAction,
];
