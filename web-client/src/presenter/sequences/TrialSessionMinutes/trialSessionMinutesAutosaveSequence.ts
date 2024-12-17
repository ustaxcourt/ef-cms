import { trialSessionMinutesAutosaveAction } from '@web-client/presenter/actions/TrialSessionMinutes/trialSessionMinutesAutosaveAction';

export const trialSessionMinutesAutosaveSequence = [
  trialSessionMinutesAutosaveAction,
] as unknown as () => void;
