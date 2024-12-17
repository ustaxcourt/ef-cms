import { DownloadPdfHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { downloadMinuteSheetFormPdfAction } from '@web-client/presenter/actions/TrialSessionMinutes/downloadMinuteSheetFormPdfAction';

export const downloadMinuteSheetFormPdfSequence = [
  downloadMinuteSheetFormPdfAction,
] as unknown as DownloadPdfHandler;
