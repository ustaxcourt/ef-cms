import { state } from '@web-client/presenter/app.cerebral';

export const setStepIndicatorAction = ({ props, store }: ActionProps) => {
  store.set(state.stepIndicatorInfo.currentStep, props.step);
};
