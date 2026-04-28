import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { startReadOnlyModePollingAction } from './startReadOnlyModePollingAction';

jest.useFakeTimers();

describe('startReadOnlyModePollingAction', () => {
  let mockSocketStart: jest.Mock;

  beforeEach(() => {
    jest.clearAllTimers();
    mockSocketStart = jest.fn().mockResolvedValue(undefined);
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.socket = { start: mockSocketStart };

    applicationContext.getConstants = () =>
      ({ READ_ONLY_POLLING_INTERVAL: 10000 }) as any;
  });

  it('sets a polling interval on state.readOnlyPollingInterval', async () => {
    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockResolvedValue({
        maintenanceMode: false,
        readOnlyMode: true,
      });

    const result = await runAction(startReadOnlyModePollingAction, {
      modules: { presenter },
      state: {
        readOnlyMode: true,
      },
    });

    expect(result.state.readOnlyPollingInterval).toBeDefined();
  });

  it('polls getMaintenanceModeInteractor at the configured interval and stops when readOnlyMode turns false', async () => {
    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockResolvedValue({
        maintenanceMode: false,
        readOnlyMode: false,
      });

    await runAction(startReadOnlyModePollingAction, {
      modules: { presenter },
      state: { readOnlyMode: true },
    });

    // Fire the interval's setTimeout callback
    jest.advanceTimersByTime(10000);
    await Promise.resolve();
    await Promise.resolve();

    expect(
      applicationContext.getUseCases().getMaintenanceModeInteractor,
    ).toHaveBeenCalled();
  });

  it('clears an existing polling interval before starting a new one', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockResolvedValue({
        maintenanceMode: false,
        readOnlyMode: true,
      });

    const existingInterval = 12345 as unknown as NodeJS.Timeout;

    await runAction(startReadOnlyModePollingAction, {
      modules: { presenter },
      state: {
        readOnlyMode: true,
        readOnlyPollingInterval: existingInterval,
      },
    });

    expect(clearIntervalSpy).toHaveBeenCalledWith(existingInterval);
    clearIntervalSpy.mockRestore();
  });

  it('does not surface errors from the polling interactor', async () => {
    applicationContext
      .getUseCases()
      .getMaintenanceModeInteractor.mockRejectedValue(
        new Error('network error'),
      );
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await runAction(startReadOnlyModePollingAction, {
      modules: { presenter },
      state: { readOnlyMode: true },
    });

    jest.advanceTimersByTime(10000);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(errorSpy).toHaveBeenCalledWith(
      'Error polling for read-only mode status',
      expect.any(Error),
    );
    errorSpy.mockRestore();
  });
});
