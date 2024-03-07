import { state } from '@web-client/presenter/app.cerebral';

export const batchDownloadDocketEntriesAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const docketEntries = get(state.documentsSelectedForDownload);

  const caseDetail = get(state.caseDetail);

  const { caseCaption, docketNumber } = caseDetail;
  // console.log('documentIds', documentIds);
  try {
    await applicationContext
      .getUseCases()
      .batchDownloadDocketEntriesInteractor(applicationContext, {
        caseCaption,
        docketEntries,
        docketNumber,
      });

    return path.success();
  } catch (e) {
    return path.error({ showModal: 'FileCompressionErrorModal' });
  }
};
