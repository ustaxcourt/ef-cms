import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { startScanAction } from './startScanAction';

let mockStartScanSession = jest.fn(() => ({
  scannedBuffer: [],
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

describe('startScanAction', () => {
  it('tells the TWAIN library to begin image aquisition', async () => {
    const result = await runAction(startScanAction, {
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

    expect(result.state.isScanning).toBeTruthy();
    expect(mockStartScanSession).toHaveBeenCalled();
  });

  it('tells the TWAIN library to begin image aquisition with no scanning device set', async () => {
    await runAction(startScanAction, {
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

    const result = await runAction(startScanAction, {
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
