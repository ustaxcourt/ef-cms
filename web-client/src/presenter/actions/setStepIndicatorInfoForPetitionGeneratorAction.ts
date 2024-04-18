import { state } from '@web-client/presenter/app.cerebral';

export const setStepIndicatorInfoForPetitionGeneratorAction = ({
  store,
}: ActionProps) => {
  const stepTitles = [
    'Petition',
    'Petitioner Information',
    'IRS Notice',
    'Case Procedure & Trial Location',
    'Statement of Taxpayer Identification',
    'Review & Submit Case',
    'Pay Filing Fee',
  ];

  store.set(state.stepIndicatorInfo, {
    currentStep: 3,
    steps: stepTitles,
  });
};
