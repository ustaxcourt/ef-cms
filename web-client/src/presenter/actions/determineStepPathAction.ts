import { state } from '@web-client/presenter/app.cerebral';

export const determineStepPathAction = ({ get, path }: ActionProps) => {
  const { currentStep } = get(state.stepIndicatorInfo);
  const pathName = `step${currentStep}`;

  const PATH_DICTIONARY = {
    1: 'PetitionerInformation',
  };

  const pathFunctionName = PATH_DICTIONARY[currentStep] || pathName;
  return path[pathFunctionName]();
};
