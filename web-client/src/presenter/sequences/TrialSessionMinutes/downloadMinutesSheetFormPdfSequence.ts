import { DownloadPdfHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { downloadMinutesSheetFormPdfAction } from '@web-client/presenter/actions/TrialSessionMinutes/downloadMinutesSheetFormPdfAction';

export const downloadMinutesSheetFormPdfSequence = [
  downloadMinutesSheetFormPdfAction,
] as unknown as DownloadPdfHandler;
