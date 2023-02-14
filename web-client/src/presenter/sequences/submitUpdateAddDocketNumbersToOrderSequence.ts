import { clearModalAction } from '../actions/clearModalAction';
import { saveSelectedDocketNumbersAction } from '../actions/saveSelectedDocketNumbersAction';

export const submitUpdateAddDocketNumbersToOrderSequence = [
  clearModalAction,
  saveSelectedDocketNumbersAction,
];
