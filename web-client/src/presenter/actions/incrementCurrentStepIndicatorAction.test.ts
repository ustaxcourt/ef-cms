import { incrementCurrentStepIndicatorAction } from './incrementCurrentStepIndicatorAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('incrementCurrentStepIndicatorAction', () => {
  it('should increase the current step value in state', async () => {
    const { state } = await runAction(incrementCurrentStepIndicatorAction, {
      state: {
        stepIndicatorInfo: {
          currentStep: 1,
        },
      },
    });
    expect(state.stepIndicatorInfo.currentStep).toEqual(2);
  });
});
