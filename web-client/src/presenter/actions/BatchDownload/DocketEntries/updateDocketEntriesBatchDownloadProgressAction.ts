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
  const docketEtriesBatchDownloadProgress = get(
    state.docketEtriesBatchDownloadProgress,
  );

  docketEtriesBatchDownloadProgress[uuid] = {
    ...docketEtriesBatchDownloadProgress[uuid],
    [index]: filesCompleted,
  };

  store.set(
    state.docketEtriesBatchDownloadProgress,
    docketEtriesBatchDownloadProgress,
  );

  const batchTotal = Object.values(
    docketEtriesBatchDownloadProgress[uuid],
  ).reduce((acc, current) => {
    return acc + current;
  }, 0 as number);

  store.set(state.batchDownloads.zipInProgress, true);
  store.set(state.batchDownloads.totalFiles, totalFiles);
  store.set(state.batchDownloads.fileCount, batchTotal);
};
