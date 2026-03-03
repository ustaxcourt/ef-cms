import { ClientApplicationContext } from "@web-client/applicationContext";

export const getPdfFromUrl = async ({
  applicationContext,
  url,
}: {
  applicationContext: ClientApplicationContext;
  url: string;
}): Promise<Blob> => {
  const { data: fileBlob } = await applicationContext.getHttpClient()({
    method: 'GET',
    responseType: 'blob',
    url,
  });

  return new Blob([fileBlob], { type: 'application/pdf' });
};
