import { state } from '@web-client/presenter/app.cerebral';

export const determineStepPathAction = ({ get, path }: ActionProps) => {
  const { currentStep } = get(state.stepIndicatorInfo);
  const pathName = `step${currentStep}`;
  return path[pathName]();
};
