import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { performanceMeasurementEndAction } from './performanceMeasurementEndAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('performanceMeasurementEndAction', () => {
  const TEST_EMAIL = 'TEST_EMAIL';

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .logUserPerformanceDataInteractor.mockImplementation(() => {});

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call "logUserPerformanceDataInteractor" with correct performance data', async () => {
    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: [
          { actionName: 'TEST_ACTION_NAME', duration: 100 },
        ],
        performanceMeasurementStart: 1,
        sequenceName: 'TEST_SEQUENCE_NAME',
      },
      state: {
        user: {
          email: TEST_EMAIL,
        },
      },
    });

    const logUserPerformanceDataInteractorCalls =
      applicationContext.getUseCases().logUserPerformanceDataInteractor.mock
        .calls;

    expect(logUserPerformanceDataInteractorCalls.length).toEqual(1);
    expect(logUserPerformanceDataInteractorCalls[0][1]).toEqual({
      actionPerformanceArray: [
        {
          actionName: 'TEST_ACTION_NAME',
          duration: 100,
        },
      ],
      duration: expect.anything(),
      email: 'TEST_EMAIL',
      sequenceName: 'TEST_SEQUENCE_NAME',
    });
  });

  it('should not call "logUserPerformanceDataInteractor" if "sequenceName" is not provided', async () => {
    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: [
          { actionName: 'TEST_ACTION_NAME', duration: 100 },
        ],
        performanceMeasurementStart: 1,
        sequenceName: undefined,
      },
      state: {
        user: {
          email: TEST_EMAIL,
        },
      },
    });

    const logUserPerformanceDataInteractorCalls =
      applicationContext.getUseCases().logUserPerformanceDataInteractor.mock
        .calls;

    expect(logUserPerformanceDataInteractorCalls.length).toEqual(0);
  });

  it('should not call "logUserPerformanceDataInteractor" if "performanceMeasurementStart" is not provided', async () => {
    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: [
          { actionName: 'TEST_ACTION_NAME', duration: 100 },
        ],
        performanceMeasurementStart: undefined,
        sequenceName: 'TEST_SEQUENCE_NAME',
      },
      state: {
        user: {
          email: TEST_EMAIL,
        },
      },
    });

    const logUserPerformanceDataInteractorCalls =
      applicationContext.getUseCases().logUserPerformanceDataInteractor.mock
        .calls;

    expect(logUserPerformanceDataInteractorCalls.length).toEqual(0);
  });

  it('should not call "logUserPerformanceDataInteractor" if "email" is not provided', async () => {
    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: [
          { actionName: 'TEST_ACTION_NAME', duration: 100 },
        ],
        performanceMeasurementStart: 1,
        sequenceName: 'TEST_SEQUENCE_NAME',
      },
      state: {
        user: {
          email: undefined,
        },
      },
    });

    const logUserPerformanceDataInteractorCalls =
      applicationContext.getUseCases().logUserPerformanceDataInteractor.mock
        .calls;

    expect(logUserPerformanceDataInteractorCalls.length).toEqual(0);
  });

  it('should not call "logUserPerformanceDataInteractor" if "actionPerformanceArray" is not provided', async () => {
    await runAction(performanceMeasurementEndAction, {
      modules: {
        presenter,
      },
      props: {
        actionPerformanceArray: undefined,
        performanceMeasurementStart: 1,
        sequenceName: 'TEST_SEQUENCE_NAME',
      },
      state: {
        user: {
          email: TEST_EMAIL,
        },
      },
    });

    const logUserPerformanceDataInteractorCalls =
      applicationContext.getUseCases().logUserPerformanceDataInteractor.mock
        .calls;

    expect(logUserPerformanceDataInteractorCalls.length).toEqual(0);
  });
});
