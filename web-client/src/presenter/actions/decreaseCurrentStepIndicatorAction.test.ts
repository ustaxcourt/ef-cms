import { decreaseCurrentStepIndicatorAction } from './decreaseCurrentStepIndicatorAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('decreaseCurrentStepIndicatorAction', () => {
  it('should decrease the current step value in state', async () => {
    const { state } = await runAction(decreaseCurrentStepIndicatorAction, {
      state: {
        stepIndicatorInfo: {
          currentStep: 3,
        },
      },
    });
    expect(state.stepIndicatorInfo.currentStep).toEqual(2);
  });
});
