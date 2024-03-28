import { state } from '@web-client/presenter/app.cerebral';

export const updateStepIndicatorCurrentStepAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.stepIndicatorInfo.currentStep, props.currentStep);
};
