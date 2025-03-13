import { AddRowHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { addMinuteSheetFormRowAction } from '@web-client/presenter/actions/TrialSessionMinutes/addMinuteSheetFormRowAction';

export const addMinuteSheetFormRowSequence = [
  addMinuteSheetFormRowAction,
] as unknown as AddRowHandler;
