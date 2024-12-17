import { OnChangeHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { takeMinuteSheetFormSnapshotAction } from '@web-client/presenter/actions/TrialSessionMinutes/takeMinuteSheetFormSnapshotAction';
import { updateTrialSessionMinutesFormAction } from '@web-client/presenter/actions/TrialSessionMinutes/updateTrialSessionMinutesFormAction';

export const updateTrialSessionMinutesFormSequence = [
  updateTrialSessionMinutesFormAction,
  takeMinuteSheetFormSnapshotAction,
] as unknown as OnChangeHandler;
