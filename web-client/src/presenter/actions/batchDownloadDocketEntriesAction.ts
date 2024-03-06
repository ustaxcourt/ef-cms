import { state } from '@web-client/presenter/app.cerebral';

export const batchDownloadDocketEntriesAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const documentIds = get(state.documentsSelectedForDownload);
  console.log('documentIds', documentIds);
  try {
    await applicationContext
      .getUseCases()
      .batchDownloadDocketEntriesInteractor(applicationContext, {
        documentIds,
      });

    return path.success();
  } catch (e) {
    return path.error({ showModal: 'FileCompressionErrorModal' });
  }
};
