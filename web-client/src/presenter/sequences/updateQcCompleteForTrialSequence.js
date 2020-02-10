import { setQcCompleteOnCaseOnTrialSessionAction } from '../actions/TrialSession/setQcCompleteOnCaseOnTrialSessionAction';
import { updateQcCompleteForTrialAction } from '../actions/TrialSession/updateQcCompleteForTrialAction';
import { validatePetitionerInformationFormAction } from '../actions/validatePetitionerInformationFormAction';

export const updateQcCompleteForTrialSequence = validatePetitionerInformationFormAction(
  [
    updateQcCompleteForTrialAction,
    { error: [], success: [setQcCompleteOnCaseOnTrialSessionAction] },
  ],
);
