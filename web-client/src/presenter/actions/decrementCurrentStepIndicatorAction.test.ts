import { decrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/decrementCurrentStepIndicatorAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('decrementCurrentStepIndicatorAction', () => {
  it('should decrease the current step value in state', async () => {
    const { state } = await runAction(decrementCurrentStepIndicatorAction, {
      state: {
        stepIndicatorInfo: {
          currentStep: 2,
        },
      },
    });
    expect(state.stepIndicatorInfo.currentStep).toEqual(1);
  });
});
