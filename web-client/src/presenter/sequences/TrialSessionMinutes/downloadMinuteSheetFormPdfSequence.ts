import { DownloadPdfHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { downloadMinuteSheetFormPdfAction } from '@web-client/presenter/actions/TrialSessionMinutes/downloadMinuteSheetFormPdfAction';
import { trialSessionMinutesAutosaveAction } from '@web-client/presenter/actions/TrialSessionMinutes/trialSessionMinutesAutosaveAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';

export const downloadMinuteSheetFormPdfSequence = showProgressSequenceDecorator(
  [
    () => ({ forceAutosave: true }),
    trialSessionMinutesAutosaveAction,
    downloadMinuteSheetFormPdfAction,
  ],
) as unknown as DownloadPdfHandler;
