import { runAction } from '@web-client/presenter/test.cerebral';
import { updateStepIndicatorCurrentStepAction } from './updateStepIndicatorCurrentStepAction';

describe('updateStepIndicatorCurrentStepAction', () => {
  it('should set the step indicator current step', async () => {
    const currentStep = 2;
    const { state } = await runAction(updateStepIndicatorCurrentStepAction, {
      props: {
        currentStep,
      },
      state: {
        stepIndicatorInfo: {
          currentStep: 1,
        },
      },
    });
    expect(state.stepIndicatorInfo.currentStep).toEqual(currentStep);
  });
});
