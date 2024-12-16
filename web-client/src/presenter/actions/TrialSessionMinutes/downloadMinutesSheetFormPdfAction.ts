import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { state } from '@web-client/presenter/app.cerebral';

export const downloadMinutesSheetFormPdfAction = async ({
  applicationContext,
  get,
}) => {
  const minuteSheetFormState = get(state.minuteSheetForm);

  const formattedMinutesSheet = formatMinuteSheet(minuteSheetFormState);

  const pdfUrl = await applicationContext
    .getUseCases()
    .generateTrialSessionMinutesPdfInteractor(applicationContext, {
      docketNumber: 'docketNumber',
      formattedMinutesSheet,
      trialSessionId: 'trialSessionId',
    });

  await applicationContext.getUtilities().openUrlInNewTab({ url: pdfUrl });
};

export type FormattedMinuteSheet = {
  judge: string;
  trialClerk: string;
  courtReporter: string;
  remoteSession: boolean;
};

const formatMinuteSheet = (
  minuteSheetFormState: MinuteSheetFormState,
): FormattedMinuteSheet => {
  return {
    courtReporter: minuteSheetFormState.trialSessionMetadata.courtReporter,
    judge: minuteSheetFormState.trialSessionMetadata.judge,
    remoteSession: minuteSheetFormState.trialSessionMetadata.remoteSession,
    trialClerk: minuteSheetFormState.trialSessionMetadata.trialClerk,
  };
};
