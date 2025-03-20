jest.mock('@shared/proxies/system/logUserPerformanceDataProxy');
jest.mock('@web-client/presenter/utilities/performanceMonitor');
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { performanceMeasurementEndAction } from './performanceMeasurementEndAction';
import { logUserPerformanceDataInteractor as mockLogUserPerformanceDataInteractor } from '@shared/proxies/system/logUserPerformanceDataProxy';
import { getPerformanceMonitor as mockGetPerformanceMonitor } from '@web-client/presenter/utilities/performanceMonitor';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('performanceMeasurementEndAction', () => {
  const TEST_EMAIL = 'TEST_EMAIL';
  const SEQUENCE_NAME = 'TEST_SEQUENCE_NAME';
  const ACTION_NAME = 'TEST_ACTION_NAME';
  const ACTION_DURATION = 100;

  const logUserPerformanceDataInteractor = jest.mocked(
    mockLogUserPerformanceDataInteractor,
  );
  const getPerformanceMonitor = jest.mocked(mockGetPerformanceMonitor);

  const mockAddPerformanceMetric = jest.fn();
  const mockDrainPerformanceMetrics = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    logUserPerformanceDataInteractor.mockImplementation(async () => {});

    mockDrainPerformanceMetrics.mockImplementation(async () => {});

    getPerformanceMonitor.mockReturnValue({
      addPerformanceMetric: mockAddPerformanceMetric,
      drainPerformanceMetrics: mockDrainPerformanceMetrics,
    } as any);

    presenter.providers.applicationContext = applicationContext;
  });

  it('should add performance metrics and drain them when all required data is present', async () => {
    const startTime = 1000;
    const currentTime = 2000;
    jest.spyOn(Date, 'now').mockImplementation(() => currentTime);

    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: [
          { actionName: ACTION_NAME, duration: ACTION_DURATION },
        ],
        performanceMeasurementStart: startTime,
        sequenceName: SEQUENCE_NAME,
      },
      state: {
        token: 'test-token',
        user: {
          email: TEST_EMAIL,
        },
      },
    });

    expect(mockAddPerformanceMetric).toHaveBeenCalledWith({
      sequencePerformance: {
        actionPerformanceArray: [
          { actionName: ACTION_NAME, duration: ACTION_DURATION },
        ],
        duration: currentTime - startTime,
        sequenceName: SEQUENCE_NAME,
      },
    });

    expect(mockDrainPerformanceMetrics).toHaveBeenCalled();
  });

  it('should not proceed when sequenceName is not provided', async () => {
    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: [
          { actionName: ACTION_NAME, duration: ACTION_DURATION },
        ],
        performanceMeasurementStart: 1000,
        sequenceName: undefined,
      },
      state: {
        token: 'test-token',
        user: {
          email: TEST_EMAIL,
        },
      },
    });

    expect(mockAddPerformanceMetric).not.toHaveBeenCalled();
    expect(mockDrainPerformanceMetrics).not.toHaveBeenCalled();
  });

  it('should not proceed when performanceMeasurementStart is not provided', async () => {
    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: [
          { actionName: ACTION_NAME, duration: ACTION_DURATION },
        ],
        performanceMeasurementStart: undefined,
        sequenceName: SEQUENCE_NAME,
      },
      state: {
        token: 'test-token',
        user: {
          email: TEST_EMAIL,
        },
      },
    });

    expect(mockAddPerformanceMetric).not.toHaveBeenCalled();
    expect(mockDrainPerformanceMetrics).not.toHaveBeenCalled();
  });

  it('should not proceed when actionPerformanceArray is not provided', async () => {
    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: undefined,
        performanceMeasurementStart: 1000,
        sequenceName: SEQUENCE_NAME,
      },
      state: {
        token: 'test-token',
        user: {
          email: TEST_EMAIL,
        },
      },
    });

    expect(mockAddPerformanceMetric).not.toHaveBeenCalled();
    expect(mockDrainPerformanceMetrics).not.toHaveBeenCalled();
  });

  it('should not proceed when userToken is not provided', async () => {
    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: [
          { actionName: ACTION_NAME, duration: ACTION_DURATION },
        ],
        performanceMeasurementStart: 1000,
        sequenceName: SEQUENCE_NAME,
      },
      state: {
        token: undefined,
        user: {
          email: TEST_EMAIL,
        },
      },
    });

    expect(mockAddPerformanceMetric).not.toHaveBeenCalled();
    expect(mockDrainPerformanceMetrics).not.toHaveBeenCalled();
  });

  it('should handle errors in drainPerformanceMetrics gracefully', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    mockDrainPerformanceMetrics.mockImplementation(() => {
      throw new Error('Test error');
    });

    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: [
          { actionName: ACTION_NAME, duration: ACTION_DURATION },
        ],
        performanceMeasurementStart: 1000,
        sequenceName: SEQUENCE_NAME,
      },
      state: {
        token: 'test-token',
        user: {
          email: TEST_EMAIL,
        },
      },
    });

    expect(mockAddPerformanceMetric).toHaveBeenCalled();

    expect(console.error).toHaveBeenCalledWith('Error posting performance');

    console.error = originalConsoleError;
  });
});
