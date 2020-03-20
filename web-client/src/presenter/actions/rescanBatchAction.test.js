import { Scan } from '../../../../shared/src/business/entities/Scan';
import { presenter } from '../presenter';
import { rescanBatchAction } from './rescanBatchAction';
import { runAction } from 'cerebral/test';

let mockStartScanSession = jest.fn(() => ({
  scannedBuffer: [{ e: 5 }, { f: 6 }],
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

const successStub = jest.fn();
const errorStub = jest.fn();

presenter.providers.path = {
  error: errorStub,
  success: successStub,
};
global.alert = () => null;

describe('rescanBatchAction', () => {
  it('rescans the batch based on the state.scanner.batchIndexToRescan and state.currentViewMetadata.documentSelectedForScan and replaces that batch with the return from startScanSession', async () => {
    const result = await runAction(rescanBatchAction, {
      modules: {
        presenter,
      },
      props: {
        scanMode: SCAN_MODES.FEEDER,
        scannerSourceIndex: 0,
        scannerSourceName: 'scanner',
      },
      state: {
        documentSelectedForScan: 'petition',
        scanner: {
          batchIndexToRescan: 1,
          batches: {
            petition: [
              { index: 0, pages: [{ a: 1 }, { b: 2 }] },
              { index: 1, pages: [{ c: 3 }, { d: 4 }] },
            ],
          },
          isScanning: false,
        },
      },
    });

    expect(result.state.scanner.isScanning).toBeFalsy();
    expect(mockStartScanSession).toHaveBeenCalled();
    expect(result.state.scanner.batches.petition[1].pages).toEqual([
      { e: 5 },
      { f: 6 },
    ]);
  });

  it('tells the TWAIN library to begin image acquisition with no scanning device set', async () => {
    await runAction(rescanBatchAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {
          isScanning: false,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
  });

  it('sets the selectedBatchIndex based on the rescanned batch', async () => {
    const result = await runAction(rescanBatchAction, {
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
          batchIndexToRescan: 2,
          batches: {
            petition: [
              { index: 0, pages: [{ a: 1 }, { b: 2 }] },
              { index: 2, pages: [{ c: 3 }, { d: 4 }] },
            ],
          },
          isScanning: false,
          selectedBatchIndex: 0,
        },
      },
    });

    expect(result.state.scanner.selectedBatchIndex).toEqual(2);
  });

  it('should call path of error on errors', async () => {
    mockStartScanSession = jest.fn(() => {
      throw new Error('no images in buffer');
    });

    await runAction(rescanBatchAction, {
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

    expect(errorStub).toHaveBeenCalled();
  });
});
