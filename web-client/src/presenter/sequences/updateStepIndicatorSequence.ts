import { setStepIndicatorAction } from '@web-client/presenter/actions/setStepIndicatorAction';

export const updateStepIndicatorSequence = [
  setStepIndicatorAction,
] as unknown as (props: { step: number }) => void;
