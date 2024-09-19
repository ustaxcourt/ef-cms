import { decrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/decrementCurrentStepIndicatorAction';

export const filePetitionGoBackAStepSequence = [
  decrementCurrentStepIndicatorAction,
] as unknown as () => void;
