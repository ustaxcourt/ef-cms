import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { primeScannerSourceAction } from '../actions/primeScannerSourceAction';
import { setScannerSourceAction } from '../actions/setScannerSourceAction';

export const selectScannerSequence = [
  () => {
    console.log('here!');
  },
  primeScannerSourceAction,
  setScannerSourceAction,
  clearModalAction,
  clearModalStateAction,
];
