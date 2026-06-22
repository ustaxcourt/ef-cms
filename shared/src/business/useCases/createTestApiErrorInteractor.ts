import { ClientApplicationContext } from '@web-client/applicationContext';
import { getCurrentUserToken } from '@web-client/proxies/requests';

export const createTestApiErrorInteractor = (
  applicationContext: ClientApplicationContext,
  { url }: { url: string },
) => {
  return applicationContext.getHttpClient().get(url, {
    headers: {
      authorization: `Bearer ${getCurrentUserToken()}`,
    },
  });
};
