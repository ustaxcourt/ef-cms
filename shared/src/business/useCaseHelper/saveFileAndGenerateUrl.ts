export const saveFileAndGenerateUrl = async ({
  applicationContext,
  file,
  URLTTL,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  file: Blob;
  useTempBucket?: boolean;
  // time to live of link in seconds
  URLTTL?: number;
}): Promise<{
  fileId: string;
  url: string;
}> => {
  const fileId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: file,
    key: fileId,
    useTempBucket,
  });

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      URLTTL,
      applicationContext,
      key: fileId,
      useTempBucket,
    });
  return { fileId, url };
};
