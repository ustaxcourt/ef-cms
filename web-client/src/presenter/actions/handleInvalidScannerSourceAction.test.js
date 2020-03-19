import { handleInvalidScannerSourceAction } from './handleInvalidScannerSourceAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const mockStorage = {
  scannerSourceIndex: 1,
  scannerSourceName: 'TC3000 Tricorder',
};

presenter.providers.applicationContext = {
  getUseCases: () => ({
    removeItemInteractor: ({ key }) => {
      mockStorage[key] = null;
    },
  }),
};

describe('handleInvalidScannerSourceAction', () => {
  it('should clear the scanner source and show the ScanErrorModal modal when a scan source is invalid', async () => {
    const result = await runAction(handleInvalidScannerSourceAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {
          isScanning: true,
          scannerSourceIndex: mockStorage.scannerSourceIndex,
          scannerSourceName: mockStorage.scannerSourceName,
        },
        showModal: '',
      },
    });

    expect(result.state.scanner.scannerSourceIndex).toBeUndefined();
    expect(result.state.scanner.scannerSourceName).toBeUndefined();
    expect(mockStorage.scannerSourceIndex).toBeNull();
    expect(mockStorage.scannerSourceName).toBeNull();
    expect(result.state.showModal).toEqual('ScanErrorModal');
    expect(result.state.scanner.isScanning).toBeFalsy();
  });
});
