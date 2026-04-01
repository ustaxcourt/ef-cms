export const loadPDFForPreviewInteractor = async (
  applicationContext,
  {
    documentStorageId,
    docketNumber,
  }: { documentStorageId?: string; docketNumber?: string },
): Promise<Blob> => {
  try {
    return await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      docketNumber,
      key: documentStorageId,
    });
  } catch (err) {
    applicationContext.logger.error(
      `error loading PDF for preview with documentStorageId ${documentStorageId}`,
      err,
    );
    throw new Error('error loading PDF for preview');
  }
};
