import { runAction } from '@web-client/presenter/test.cerebral';
import { setStepIndicatorAction } from '@web-client/presenter/actions/setStepIndicatorAction';

describe('setStepIndicatorAction', () => {
  it('should set the provided step value in state', async () => {
    const { state } = await runAction(setStepIndicatorAction, {
      props: { step: 3 },
      state: {
        stepIndicatorInfo: {
          currentStep: 6,
        },
      },
    });
    expect(state.stepIndicatorInfo.currentStep).toEqual(3);
  });
});
