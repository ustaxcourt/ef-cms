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

  [
    [1, 'step1'],
    [2, 'step2'],
    [3, 'step3'],
    [4, 'step4'],
    [5, 'step5'],
    [6, 'step6'],
  ].forEach(([currentStep, pathName]) => {
    it(`should call the correct path when passing in "${currentStep}" as the current step`, async () => {
      const TEST_PATHS = {
        [pathName]: jest.fn(),
      };

      presenter.providers.path = TEST_PATHS;

      expect(TEST_PATHS[pathName].mock.calls.length).toEqual(0);

      await runAction(determineStepPathAction, {
        modules: {
          presenter,
        },
        state: {
          stepIndicatorInfo: {
            currentStep,
          },
        },
      });

      expect(TEST_PATHS[pathName].mock.calls.length).toEqual(1);
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
