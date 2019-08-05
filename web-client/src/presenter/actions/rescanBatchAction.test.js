import { presenter } from '../presenter';
import { rescanBatchAction } from './rescanBatchAction';
import { runAction } from 'cerebral/test';

let mockStartScanSession = jest.fn(() => ({
  scannedBuffer: [{ e: 5 }, { f: 6 }],
}));
const mockRemoveItemInteractor = jest.fn();

presenter.providers.applicationContext = {
  getScanner: () => ({
    getSourceNameByIndex: () => 'scanner',
    setSourceByIndex: () => null,
    startScanSession: mockStartScanSession,
  }),
  getUseCases: () => ({
    removeItemInteractor: mockRemoveItemInteractor,
  }),
};
global.alert = () => null;

describe('rescanBatchAction', () => {
  it('rescans the batch based on the state.batchIndexToRescan and state.documentSelectedForScan and replaces that batch with the return from startScanSession', async () => {
    const result = await runAction(rescanBatchAction, {
      modules: {
        presenter,
      },
      props: {
        scannerSourceIndex: 0,
        scannerSourceName: 'scanner',
      },
      state: {
        batchIndexToRescan: 1,
        batches: {
          petition: [
            { index: 0, pages: [{ a: 1 }, { b: 2 }] },
            { index: 1, pages: [{ c: 3 }, { d: 4 }] },
          ],
        },
        documentSelectedForScan: 'petition',
        isScanning: false,
      },
    });

    expect(result.state.isScanning).toBeTruthy();
    expect(mockStartScanSession).toHaveBeenCalled();
    expect(result.state.batches.petition[1].pages).toEqual([
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
        isScanning: false,
      },
    });

    expect(mockRemoveItemInteractor).toHaveBeenCalled();
  });

  it('opens the hopper empty modal if an hopper empty error is thrown', async () => {
    mockStartScanSession = jest.fn(() => {
      throw new Error('no images in buffer');
    });

    const result = await runAction(rescanBatchAction, {
      modules: {
        presenter,
      },
      props: {
        scannerSourceIndex: 0,
        scannerSourceName: 'scanner',
      },
      state: {
        batches: [],
        documentSelectedForScan: 'petition',
        isScanning: false,
      },
    });

    expect(result.state.isScanning).toBeFalsy();
    expect(mockStartScanSession).toHaveBeenCalled();
    expect(result.state.showModal).toEqual('EmptyHopperModal');
  });
});
