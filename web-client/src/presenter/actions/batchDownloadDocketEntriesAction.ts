import { ALL_DOCUMENTS_SELECTED } from '../../../../shared/src/business/useCases/document/batchDownloadDocketEntriesInteractor';
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
  const { docketNumber } = caseDetail;
  const isSingleDocumentSelected = documentIds.length === 1;

  const documentsSelectedForDownload: string = isSingleDocumentSelected
    ? documentIds[0].docketEntryId
    : ALL_DOCUMENTS_SELECTED;

  try {
    await applicationContext
      .getUseCases()
      .batchDownloadDocketEntriesInteractor(applicationContext, {
        clientConnectionId,
        docketNumber,
        documentsSelectedForDownload,
        printableDocketRecordFileId: props.fileId,
      });

    return path.success();
  } catch (e) {
    return path.error({ showModal: 'FileCompressionErrorModal' });
  }
};
