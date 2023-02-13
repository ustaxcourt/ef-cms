import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { primeScannerSourceAction } from '../actions/primeScannerSourceAction';
import { setScannerSourceAction } from '../actions/setScannerSourceAction';

export const selectScannerSequence = [
  primeScannerSourceAction,
  setScannerSourceAction,
  clearModalAction,
  clearModalStateAction,
];
