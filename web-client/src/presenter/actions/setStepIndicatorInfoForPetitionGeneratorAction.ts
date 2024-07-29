import { state } from '@web-client/presenter/app.cerebral';

export const setStepIndicatorInfoForPetitionGeneratorAction = ({
  store,
}: ActionProps) => {
  const steps = {
    1: 'Petitioner Information',
    2: 'Petition',
    3: 'IRS Notice',
    4: 'Case Procedure & Trial Location',
    5: 'Statement of Taxpayer Identification Number',
    6: 'Review & Submit Case',
    7: 'Pay Filing Fee',
  };

  store.set(state.stepIndicatorInfo, {
    currentStep: 1,
    steps,
  });
};
