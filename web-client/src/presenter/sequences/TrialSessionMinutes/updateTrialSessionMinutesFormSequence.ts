import { OnChangeHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { updateTrialSessionMinutesFormAction } from '@web-client/presenter/actions/TrialSessionMinutes/updateTrialSessionMinutesFormAction';

export const updateTrialSessionMinutesFormSequence = [
  updateTrialSessionMinutesFormAction,
] as unknown as OnChangeHandler;
