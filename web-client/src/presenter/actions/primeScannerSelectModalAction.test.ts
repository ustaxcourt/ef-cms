import { presenter } from '../presenter-mock';
import { primeScannerSelectModalAction } from './primeScannerSelectModalAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('primeScannerSelectModalAction', () => {
  it('should set state.modal.scanner to the value of state.scanner.scannerSourceName', async () => {
    const mockScannerSourceName = 'Mrs. Doubtfire';

    const { state } = await runAction(primeScannerSelectModalAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {
          scannerSourceName: mockScannerSourceName,
        },
      },
    });

    expect(state.modal.scanner).toBe(mockScannerSourceName);
  });

  it('should set state.modal.index to the value of state.scanner.scannerSourceIndex', async () => {
    const mockScannerSourceIndex = 4;

    const { state } = await runAction(primeScannerSelectModalAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {
          scannerSourceIndex: mockScannerSourceIndex,
        },
      },
    });

    expect(state.modal.index).toBe(mockScannerSourceIndex);
  });

  it('should set state.modal.scanMode to the value of state.scanner.scanMode', async () => {
    const mockScanMode = 'feeder';

    const { state } = await runAction(primeScannerSelectModalAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {
          scanMode: mockScanMode,
        },
      },
    });

    expect(state.modal.scanMode).toBe(mockScanMode);
  });
});
