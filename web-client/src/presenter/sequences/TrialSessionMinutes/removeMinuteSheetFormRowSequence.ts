import { RemoveRowHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { removeMinuteSheetFormRowAction } from '@web-client/presenter/actions/TrialSessionMinutes/removeMinuteSheetFormRowAction';
import { autosaveTrialSessionMinuteSheetAction } from '@web-client/presenter/actions/TrialSessionMinutes/autosaveTrialSessionMinuteSheetAction';

export const removeMinuteSheetFormRowSequence = [
  removeMinuteSheetFormRowAction,
  autosaveTrialSessionMinuteSheetAction,
] as unknown as RemoveRowHandler;
