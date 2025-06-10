import { autosaveTrialSessionMinuteSheetAction } from '@web-client/presenter/actions/TrialSessionMinutes/autosaveTrialSessionMinuteSheetAction';
import { AutoSaveHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';

export const autosaveTrialSessionMinuteSheetSequence = [
  autosaveTrialSessionMinuteSheetAction,
] as unknown as AutoSaveHandler;
