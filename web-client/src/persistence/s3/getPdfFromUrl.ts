export const getPdfFromUrl = async ({
  applicationContext,
  url,
}: {
  applicationContext: IApplicationContext;
  url: string;
}) => {
  const { data: fileBlob } = await applicationContext.getHttpClient()({
    method: 'GET',
    responseType: 'blob',
    url,
  });

  return new Blob([fileBlob], { type: 'application/pdf' });
};
