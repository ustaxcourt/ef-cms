import { DownloadPdfHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { downloadMinuteSheetFormPdfAction } from '@web-client/presenter/actions/TrialSessionMinutes/downloadMinuteSheetFormPdfAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { autosaveTrialSessionMinuteSheetAction } from '@web-client/presenter/actions/TrialSessionMinutes/autosaveTrialSessionMinuteSheetAction';

export const downloadMinuteSheetFormPdfSequence = showProgressSequenceDecorator(
  [
    () => ({ forceAutosave: true }),
    autosaveTrialSessionMinuteSheetAction,
    downloadMinuteSheetFormPdfAction,
  ],
) as unknown as DownloadPdfHandler;
