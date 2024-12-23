import { DownloadPdfHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { downloadMinuteSheetFormPdfAction } from '@web-client/presenter/actions/TrialSessionMinutes/downloadMinuteSheetFormPdfAction';
import { trialSessionMinutesAutosaveAction } from '@web-client/presenter/actions/TrialSessionMinutes/trialSessionMinutesAutosaveAction';

export const downloadMinuteSheetFormPdfSequence = [
  () => ({ forceAutosave: true }),
  trialSessionMinutesAutosaveAction,
  downloadMinuteSheetFormPdfAction,
] as unknown as DownloadPdfHandler;
