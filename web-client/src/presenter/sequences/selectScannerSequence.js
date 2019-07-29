import { clearModalAction } from '../actions/clearModalAction';
import { primeScannerSourceAction } from '../actions/primeScannerSourceAction';
import { setScannerSourceAction } from '../actions/setScannerSourceAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';

export const selectScannerSequence = [
  primeScannerSourceAction,
  setScannerSourceAction,
  clearModalAction,
  clearModalStateAction,
];
