import { checkForNegativeValueAction } from '../actions/checkForNegativeValueAction';
import { setNegativeValueConfirmationTextAction } from '../actions/setNegativeValueConfirmationTextAction';
import { unsetNegativeValueConfirmationTextAction } from '../actions/unsetNegativeValueConfirmationTextAction';

export const checkForNegativeValueSequence = [
  checkForNegativeValueAction,
  {
    set: [setNegativeValueConfirmationTextAction],
    unset: [unsetNegativeValueConfirmationTextAction],
  },
];
