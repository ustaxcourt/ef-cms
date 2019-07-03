import { setCaseToReadyForTrialAction } from '../actions/setCaseToReadyForTrialAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const setCaseToReadyForTrialSequence = [
  setFormSubmittingAction,
  setCaseToReadyForTrialAction,
  unsetFormSubmittingAction,
];
