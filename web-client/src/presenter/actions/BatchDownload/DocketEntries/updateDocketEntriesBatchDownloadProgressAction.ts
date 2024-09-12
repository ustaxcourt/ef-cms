import { state } from '@web-client/presenter/app.cerebral';

export const updateDocketEntriesBatchDownloadProgressAction = ({
  get,
  props,
  store,
}: ActionProps<{
  filesCompleted: number;
  index: number;
  totalFiles: number;
  uuid: string;
}>) => {
  const { filesCompleted, index, totalFiles, uuid } = props;
  const docketEntriesBatchDownloadProgress = get(
    state.docketEntriesBatchDownloadProgress,
  );

  docketEntriesBatchDownloadProgress[uuid] = {
    ...docketEntriesBatchDownloadProgress[uuid],
    [index]: filesCompleted,
  };

  store.set(
    state.docketEntriesBatchDownloadProgress,
    docketEntriesBatchDownloadProgress,
  );

  const batchTotal = Object.values(
    docketEntriesBatchDownloadProgress[uuid],
  ).reduce((acc, current) => {
    return acc + current;
  }, 0 as number);

  store.set(state.batchDownloads.zipInProgress, true);
  store.set(state.batchDownloads.totalFiles, totalFiles);
  store.set(state.batchDownloads.fileCount, batchTotal);
};
