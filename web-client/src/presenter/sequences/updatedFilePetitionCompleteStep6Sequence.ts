import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { saveAndSubmitCaseAction } from '@web-client/presenter/actions/saveAndSubmitCaseAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';

export const updatedFilePetitionCompleteStep6Sequence = [
  saveAndSubmitCaseAction,
  setAlertSuccessAction,
  incrementCurrentStepIndicatorAction,
];
