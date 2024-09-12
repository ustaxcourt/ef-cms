import { state } from '@web-client/presenter/app.cerebral';

export const batchDownloadDocketEntriesAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileId: string;
}>) => {
  const docIdsSelectedForDownload = get(state.documentsSelectedForDownload);
  const { docketEntries, docketNumber } = get(state.caseDetail);
  const clientConnectionId = get(state.clientConnectionId);
  const { docketRecordFilter } = get(state.sessionMetadata);

  const filteredDocumentsIds = applicationContext
    .getUtilities()
    .getCaseDocumentsIdsFilteredByDocumentType(applicationContext, {
      docIdsSelectedForDownload,
      docketEntries,
      docketRecordFilter,
    });

  const batchSize = 50;
  const batchedDocumentIds: string[][] = [];
  const uuid = applicationContext.getUniqueId();

  for (let i = 0; i < filteredDocumentsIds.length; i += batchSize) {
    const batchSlice = filteredDocumentsIds.slice(i, i + batchSize);
    batchedDocumentIds.push(batchSlice);
  }

  const totalNumberOfFiles = props.fileId
    ? filteredDocumentsIds.length + 1
    : filteredDocumentsIds.length;

  try {
    await Promise.all(
      batchedDocumentIds.map((batch, index) =>
        applicationContext
          .getUseCases()
          .batchDownloadDocketEntriesInteractor(applicationContext, {
            clientConnectionId,
            docketNumber,
            documentsSelectedForDownload: batch,
            index,
            printableDocketRecordFileId: !index ? props.fileId : undefined,
            totalNumberOfBatches: batchedDocumentIds.length,
            totalNumberOfFiles,
            uuid,
          }),
      ),
    );

    return path.success();
  } catch (e) {
    return path.error({ showModal: 'FileCompressionErrorModal' });
  }
};
