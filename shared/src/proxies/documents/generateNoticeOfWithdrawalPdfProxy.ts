import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const generateNoticeOfWithdrawalPdfInteractor = async (
  applicationContext: ClientApplicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    docketNumber,
    docketNumberWithSuffix,
    partiesToWithdrawFrom,
    petitioners,
  },
): Promise<{ fileId: string; url: string }> => {
  return post({
    applicationContext,
    body: {
      caseCaptionExtension,
      caseTitle,
      docketNumber,
      docketNumberWithSuffix,
      partiesToWithdrawFrom,
      petitioners,
    },
    endpoint: `/cases/${docketNumberWithSuffix}/generate-notice-of-withdrawal`,
  });
};
