import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';

export const closeModalAndReturnToCaseDetailSequence = [
  clearModalAction,
  setCasePropFromStateAction,
  navigateToCaseDetailAction,
];
