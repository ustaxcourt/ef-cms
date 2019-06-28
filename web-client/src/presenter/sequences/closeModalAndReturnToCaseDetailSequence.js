import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseIdPropFromStateAction } from '../actions/setCaseIdPropFromStateAction';

export const closeModalAndReturnToCaseDetailSequence = [
  clearModalAction,
  setCaseIdPropFromStateAction,
  navigateToCaseDetailAction,
];
