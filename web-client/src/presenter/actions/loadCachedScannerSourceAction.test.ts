import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { loadCachedScannerSourceAction } from './loadCachedScannerSourceAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('loadCachedScannerSourceAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.scanner.scannerSourceName to the value returned from persistence', async () => {
    const mockScannerSourceName = 'Mrs. Doubtfire';
    applicationContext
      .getPersistenceGateway()
      .getItem.mockReturnValue(mockScannerSourceName);

    const { state } = await runAction(loadCachedScannerSourceAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {
          scannerSourceName: undefined,
        },
      },
    });

    expect(state.scanner.scannerSourceName).toBe(mockScannerSourceName);
  });

  it('should set state.scanner.scannerSourceIndex to the value returned from persistence', async () => {
    const mockScannerSourceIndex = 4;
    applicationContext
      .getPersistenceGateway()
      .getItem.mockReturnValue(mockScannerSourceIndex);

    const { state } = await runAction(loadCachedScannerSourceAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {
          scannerSourceIndex: undefined,
        },
      },
    });

    expect(state.scanner.scannerSourceIndex).toBe(mockScannerSourceIndex);
  });
});
