import { getDocketEntriesByFilter } from '@web-client/presenter/computeds/formattedDocketEntries';
import { state } from '@web-client/presenter/app.cerebral';

export const batchDownloadDocketEntriesAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileId: string;
}>) => {
  const documentIds = get(state.documentsSelectedForDownload);
  const caseDetail = get(state.caseDetail);
  const clientConnectionId = get(state.clientConnectionId);
  const { docketEntries, docketNumber } = caseDetail;
  const { docketRecordFilter } = get(state.sessionMetadata);

  const documentsToDownload: RawDocketEntry[] = documentIds.map(docSelected => {
    const docketEntryIdKey = Object.keys(docSelected)[0];
    return docketEntries.find(
      docEntry => docEntry[docketEntryIdKey] === docSelected[docketEntryIdKey],
    );
  });

  const filteredDocuments = getDocketEntriesByFilter(applicationContext, {
    docketEntries: documentsToDownload,
    docketRecordFilter,
  });

  try {
    await applicationContext
      .getUseCases()
      .batchDownloadDocketEntriesInteractor(applicationContext, {
        clientConnectionId,
        docketNumber,
        documentsSelectedForDownload: filteredDocuments.map(
          docInfo => docInfo.docketEntryId,
        ),
        printableDocketRecordFileId: props.fileId,
      });

    return path.success();
  } catch (e) {
    return path.error({ showModal: 'FileCompressionErrorModal' });
  }
};
