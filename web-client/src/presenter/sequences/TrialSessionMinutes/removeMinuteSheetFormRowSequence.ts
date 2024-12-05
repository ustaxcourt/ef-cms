import { RemoveRowHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { removeMinuteSheetFormRowAction } from '@web-client/presenter/actions/TrialSessionMinutes/removeMinuteSheetFormRowAction';

export const removeMinuteSheetFormRowSequence = [
  removeMinuteSheetFormRowAction,
] as unknown as RemoveRowHandler;
