import { getPdfFromUrl } from './getPdfFromUrl';

const getDownloadPolicy = async ({
  applicationContext,
  docketNumber,
  key,
}: {
  applicationContext: IApplicationContext;
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
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
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
  applicationContext: IApplicationContext;
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
