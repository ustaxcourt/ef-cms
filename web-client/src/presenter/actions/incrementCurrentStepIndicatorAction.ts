import { state } from '@web-client/presenter/app.cerebral';

export const incrementCurrentStepIndicatorAction = ({
  get,
  store,
}: ActionProps) => {
  const currentStep = get(state.stepIndicatorInfo.currentStep);
  // if (currentStep == 3) {
  //   store.set(state.stepIndicatorInfo.currentStep, 5);
  // } else {
  store.set(state.stepIndicatorInfo.currentStep, currentStep + 1);
  // }
};
