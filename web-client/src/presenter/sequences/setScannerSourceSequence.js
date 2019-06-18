import { clearModalAction } from '../actions/clearModalAction';
import { setScannerSourceAction } from '../actions/setScannerSourceAction';

export const setScannerSourceSequence = [
  setScannerSourceAction,
  clearModalAction,
];
