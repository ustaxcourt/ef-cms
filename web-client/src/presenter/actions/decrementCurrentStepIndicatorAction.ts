import { state } from '@web-client/presenter/app.cerebral';

export const decrementCurrentStepIndicatorAction = ({
  get,
  store,
}: ActionProps) => {
  const currentStep = get(state.stepIndicatorInfo.currentStep);
  store.set(state.stepIndicatorInfo.currentStep, currentStep - 1);
};
