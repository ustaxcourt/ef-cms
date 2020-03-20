import { Scan } from '../../../../shared/src/business/entities/Scan';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { startScanAction } from './startScanAction';

let mockStartScanSession = jest.fn(() => ({
  scannedBuffer: [],
}));
const mockRemoveItemInteractor = jest.fn();
const { SCAN_MODES } = Scan;

presenter.providers.applicationContext = {
  getConstants: () => ({
    SCAN_MODES,
  }),
  getScanner: () => ({
    getSourceNameByIndex: () => 'scanner',
    setSourceByIndex: () => null,
    startScanSession: mockStartScanSession,
  }),
  getUseCases: () => ({
    removeItemInteractor: mockRemoveItemInteractor,
  }),
};

presenter.providers.path = {
  error: jest.fn(),
  success: jest.fn(),
};

global.alert = () => null;

describe('startScanAction', () => {
  it('tells the TWAIN library to begin image acquisition', async () => {
    const result = await runAction(startScanAction, {
      modules: {
        presenter,
      },
      props: {
        scanMode: SCAN_MODES.FEEDER,
        scannerSourceIndex: 0,
        scannerSourceName: 'scanner',
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batches: [],
          isScanning: false,
        },
      },
    });

    expect(result.state.scanner.isScanning).toBeTruthy();
  });

  it('expect the success path to be called', async () => {
    await runAction(startScanAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {
          isScanning: false,
        },
      },
    });

    expect(presenter.providers.path.success).toHaveBeenCalled();
  });

  it('expect the selectedBatchIndex to change to the last one scanned', async () => {
    const result = await runAction(startScanAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batches: {
            petition: [
              {
                index: 5,
              },
            ],
          },
          isScanning: false,
        },
      },
    });

    expect(result.state.scanner.selectedBatchIndex).toEqual(6);
  });

  it('calls the error path on errors', async () => {
    mockStartScanSession = jest.fn(() => {
      throw new Error('no images in buffer');
    });

    await runAction(startScanAction, {
      modules: {
        presenter,
      },
      props: {
        scanMode: SCAN_MODES.FEEDER,
        scannerSourceIndex: 0,
        scannerSourceName: 'scanner',
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batches: [],
          isScanning: false,
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalled();
  });
});
