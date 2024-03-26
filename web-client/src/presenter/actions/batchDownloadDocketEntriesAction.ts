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

  try {
    await applicationContext
      .getUseCases()
      .batchDownloadDocketEntriesInteractor(applicationContext, {
        clientConnectionId,
        docketNumber,
        documentsSelectedForDownload: filteredDocumentsIds,
        printableDocketRecordFileId: props.fileId,
      });

    return path.success();
  } catch (e) {
    return path.error({ showModal: 'FileCompressionErrorModal' });
  }
};
