exports.getPdfFromUrl = async ({ applicationContext, url }) => {
  const { data: fileBlob } = await applicationContext.getHttpClient()({
    method: 'GET',
    responseType: 'blob',
    url,
  });

  return new Blob([fileBlob], { type: 'application/pdf' });
};
