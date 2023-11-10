import { post } from '../requests';

export const generateTrialSessionPaperServicePdfInteractor = (
  applicationContext,
  {
    trialNoticePdfsKeys,
    trialSessionId,
  }: { trialNoticePdfsKeys: string[]; trialSessionId: string },
): Promise<void> => {
  return post({
    applicationContext,
    body: { trialNoticePdfsKeys, trialSessionId },
    endpoint: '/async/trial-sessions/paper-service-pdf',
  });
};
