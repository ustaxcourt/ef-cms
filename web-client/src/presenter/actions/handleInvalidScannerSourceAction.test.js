import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { handleInvalidScannerSourceAction } from './handleInvalidScannerSourceAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('handleInvalidScannerSourceAction', () => {
  const mockStorage = {
    scannerSourceIndex: 1,
    scannerSourceName: 'TC3000 Tricorder',
  };

  beforeAll(() => {
    applicationContext.getUseCases().removeItemInteractor = jest.fn(
      (appContext, { key }) => {
        mockStorage[key] = null;
      },
    );

    presenter.providers.applicationContext = applicationContext;
  });

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
    expect(result.state.modal.showModal).toEqual('ScanErrorModal');
    expect(result.state.scanner.isScanning).toBeFalsy();
  });
});
