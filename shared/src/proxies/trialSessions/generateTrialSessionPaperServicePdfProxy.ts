import { post } from '../requests';

export const generateTrialSessionPaperServicePdfInteractor = (
  applicationContext,
  { trialNoticePdfsKeys },
) => {
  return post({
    applicationContext,
    body: { trialNoticePdfsKeys },
    endpoint: '/async/trial-sessions/paper-service-pdf',
  });
};
