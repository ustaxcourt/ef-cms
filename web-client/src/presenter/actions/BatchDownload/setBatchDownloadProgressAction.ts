import { state } from '@web-client/presenter/app.cerebral';

export const setBatchDownloadProgressAction = ({
  store,
}: ActionProps<{
  totalFiles: number;
  action: string;
  filesCompleted: number;
}>) => {
  store.set(state.batchDownloads.zipInProgress, true);
  store.set(state.batchDownloads.title, 'Preparing Files');
};
