import { generateTrialSessionMinutesPdfInteractor } from '@shared/proxies/trialSessionMinutes/generateTrialSessionMinutesPdfProxy';
import { openUrlInNewTab } from '@web-client/presenter/utilities/openUrlInNewTab';
import { state } from '@web-client/presenter/app.cerebral';

export const downloadMinuteSheetFormPdfAction = async ({ get }) => {
  const { docketNumber } = get(state.caseDetail);
  const { trialSessionId } = get(state.trialSession);

  const pdfUrl = await generateTrialSessionMinutesPdfInteractor({
    docketNumber,
    trialSessionId,
  });

  await openUrlInNewTab({ url: pdfUrl });
};
