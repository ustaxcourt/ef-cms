import { RemoveRowHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { removeMinuteSheetFormRowAction } from '@web-client/presenter/actions/TrialSessionMinutes/removeMinuteSheetFormRowAction';
import { trialSessionMinutesAutosaveAction } from '@web-client/presenter/actions/TrialSessionMinutes/trialSessionMinutesAutosaveAction';

export const removeMinuteSheetFormRowSequence = [
  removeMinuteSheetFormRowAction,
  trialSessionMinutesAutosaveAction,
] as unknown as RemoveRowHandler;
