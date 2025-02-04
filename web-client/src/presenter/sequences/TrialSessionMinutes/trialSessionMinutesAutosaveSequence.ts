import { trialSessionMinutesAutosaveAction } from '@web-client/presenter/actions/TrialSessionMinutes/trialSessionMinutesAutosaveAction';
import { AutoSaveHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';

export const trialSessionMinutesAutosaveSequence = [
  trialSessionMinutesAutosaveAction,
] as unknown as AutoSaveHandler;
