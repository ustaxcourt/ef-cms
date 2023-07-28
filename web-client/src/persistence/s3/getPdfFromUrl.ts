export const getPdfFromUrl = async ({
  applicationContext,
  url,
}: {
  applicationContext: IApplicationContext;
  url: string;
}): Promise<Blob> => {
  const { data: fileBlob } = await applicationContext.getHttpClient()({
    method: 'GET',
    responseType: 'blob',
    url,
  });

  return new Blob([fileBlob], { type: 'application/pdf' });
};
