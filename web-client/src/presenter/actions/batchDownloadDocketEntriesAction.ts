import { state } from '@web-client/presenter/app.cerebral';

export const batchDownloadDocketEntriesAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileId: string;
}>) => {
  const documentsSelectedForDownload = get(state.documentsSelectedForDownload);
  const caseDetail = get(state.caseDetail);
  const clientConnectionId = get(state.clientConnectionId);
  const { docketRecordFilter } = get(state.sessionMetadata);
  const { docketEntries, docketNumber } = caseDetail;

  const filteredDocumentsIds = applicationContext
    .getUtilities()
    .getCaseDocumentsByFilter(applicationContext, {
      docketEntries,
      docketRecordFilter,
      documentsToProcess: documentsSelectedForDownload,
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
