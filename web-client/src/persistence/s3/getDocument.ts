import { getCurrentUserToken } from '@web-client/proxies/requests';
import { getPdfFromUrl } from './getPdfFromUrl';
import { ClientApplicationContext } from '@web-client/applicationContext';

const getDownloadPolicy = async ({
  applicationContext,
  docketNumber,
  key,
}: {
  applicationContext: ClientApplicationContext;
  docketNumber: string;
  key: string;
}): Promise<string> => {
  const {
    data: { url },
  } = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/case-documents/${docketNumber}/${key}/download-policy-url`,
      {
        headers: {
          Authorization: `Bearer ${getCurrentUserToken()}`,
        },
      },
    );
  return url;
};

export const getDocument = async ({
  applicationContext,
  docketNumber,
  key,
}: {
  applicationContext: ClientApplicationContext;
  docketNumber: string;
  key: string;
}): Promise<Blob> => {
  const url = await getDownloadPolicy({
    applicationContext,
    docketNumber,
    key,
  });

  return await getPdfFromUrl({ applicationContext, url });
};
