import { SCAN_MODES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { startScanAction } from './startScanAction';

global.alert = () => null;

describe('startScanAction', () => {
  beforeAll(() => {
    Object.assign(presenter.providers, {
      applicationContext,
      path: {
        error: jest.fn(),
        success: jest.fn(),
      },
    });
  });
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
      props: {
        scanMode: SCAN_MODES.FEEDER,
        scannerSourceIndex: 0,
        scannerSourceName: 'scanner',
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 0,
        },
        scanner: {
          batches: [],
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
    applicationContext.getScanner().startScanSession.mockImplementation(() => {
      return Promise.reject(new Error('no images in buffer'));
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
