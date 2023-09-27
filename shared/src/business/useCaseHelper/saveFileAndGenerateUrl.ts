export const saveFileAndGenerateUrl = async ({
  applicationContext,
  file,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  file: Buffer;
  useTempBucket: boolean;
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
      applicationContext,
      key: fileId,
      useTempBucket,
    });
  return { fileId, url };
};
