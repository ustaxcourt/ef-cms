import { DownloadPdfHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { autosaveTrialSessionMinuteSheetAction } from '@web-client/presenter/actions/TrialSessionMinutes/autosaveTrialSessionMinuteSheetAction';
import { saveMinuteSheetToDraftsAction } from '@web-client/presenter/actions/TrialSessionMinutes/saveMinuteSheetToDraftsAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';

export const saveMinuteSheetToDraftsSequence = showProgressSequenceDecorator([
  autosaveTrialSessionMinuteSheetAction,
  saveMinuteSheetToDraftsAction,
  {
    success: [setAlertSuccessAction],
    error: [setAlertErrorAction],
  },
]) as unknown as DownloadPdfHandler;
