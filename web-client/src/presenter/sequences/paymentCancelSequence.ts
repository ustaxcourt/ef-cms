import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { setStepIndicatorAction } from '@web-client/presenter/actions/setStepIndicatorAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { setStepIndicatorInfoForPetitionGeneratorAction } from '@web-client/presenter/actions/setStepIndicatorInfoForPetitionGeneratorAction';

//Does this need a guard once payment has been made??
//Do we need to ensure that this is your case?
export const paymentCancelSequence = [
  setStepIndicatorInfoForPetitionGeneratorAction,
  () => {
    return { step: 7 };
  },
  setStepIndicatorAction,
  getCaseAction, // Add error handling here
  setCaseAction,
  setupCurrentPageAction('FilePetition'),
];
