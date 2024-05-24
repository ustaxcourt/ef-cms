import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { determineStepPathAction } from '@web-client/presenter/actions/determineStepPathAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('determineStepPathAction', () => {
  const PATHS = {
    step1: jest.fn(),
    step2: jest.fn(),
    step3: jest.fn(),
  };

  beforeEach(() => {
    Object.assign(presenter.providers, {
      applicationContext,
      path: PATHS,
    });
  });

  it('should call path using the step in state', async () => {
    expect(PATHS.step3.mock.calls.length).toEqual(0);

    await runAction(determineStepPathAction, {
      modules: {
        presenter,
      },
      state: {
        stepIndicatorInfo: {
          currentStep: 3,
        },
      },
    });

    expect(PATHS.step3.mock.calls.length).toEqual(1);
  });
});
