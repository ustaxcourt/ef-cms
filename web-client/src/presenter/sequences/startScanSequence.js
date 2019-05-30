import { getCachedScannerSourceAction } from '../actions/getCachedScannerSourceAction';
import { setScannerSourceAction } from '../actions/setScannerSourceAction';
import { startScanAction } from '../actions/startScanAction';

export const startScanSequence = [
  getCachedScannerSourceAction,
  {
    selectSource: [setScannerSourceAction, startScanAction], // select source UI flow
    success: [startScanAction],
  },
];
