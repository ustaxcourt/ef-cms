import { DownloadPdfHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { downloadMinutesSheetFormPdfAction } from '@web-client/presenter/actions/TrialSessionMinutes/downloadMinuteSheetFormPdfAction';

export const downloadMinuteSheetFormPdfSequence = [
  downloadMinutesSheetFormPdfAction,
] as unknown as DownloadPdfHandler;
