import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const generateNoticeOfWithdrawalPdfInteractor = async (
  applicationContext: ClientApplicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    docketNumber,
    docketNumberWithSuffix,
    filers,
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
      filers,
      petitioners,
    },
    endpoint: `/cases/${docketNumberWithSuffix}/generate-notice-of-withdrawal`,
  });
};
