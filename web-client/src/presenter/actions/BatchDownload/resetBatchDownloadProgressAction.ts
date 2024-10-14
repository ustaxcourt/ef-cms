import { state } from '@web-client/presenter/app.cerebral';

export const resetBatchDownloadProgressAction = ({
  store,
}: ActionProps<{
  totalFiles: number;
  action: string;
  filesCompleted: number;
}>) => {
  store.unset(state.batchDownloads.zipInProgress);
  store.unset(state.batchDownloads.title);
};
