import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { state } from '@web-client/presenter/app.cerebral';

export const downloadMinuteSheetFormPdfAction = async ({
  applicationContext,
  get,
}) => {
  const minuteSheetFormState = get(state.minuteSheetForm);

  const formattedMinuteSheet = formatMinuteSheet(minuteSheetFormState);

  const pdfUrl = await applicationContext
    .getUseCases()
    .generateTrialSessionMinutesPdfInteractor(applicationContext, {
      docketNumber: 'docketNumber',
      formattedMinuteSheet,
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
    courtReporter:
      minuteSheetFormState.trialSessionMetadataSection.courtReporter,
    judge: minuteSheetFormState.trialSessionMetadataSection.judge,
    remoteSession:
      minuteSheetFormState.trialSessionMetadataSection.remoteSession,
    trialClerk: minuteSheetFormState.trialSessionMetadataSection.trialClerk,
  };
};
