import { state } from '@web-client/presenter/app.cerebral';

export const singleDocketEntriesBatchCompleteAction = ({
  get,
  path,
  props,
  store,
}: ActionProps<{
  index: number;
  totalNumberOfBatches: number;
  url: string;
  uuid: string;
}>) => {
  const { index, totalNumberOfBatches, url, uuid } = props;

  const docketEntriesBatchDownload = get(state.docketEntriesBatchDownload);

  docketEntriesBatchDownload[uuid] = [
    ...(docketEntriesBatchDownload[uuid] || []),
    { index, url },
  ];

  store.set(state.docketEntriesBatchDownload, docketEntriesBatchDownload);

  const completedBatchCount = docketEntriesBatchDownload[uuid].length;
  if (completedBatchCount !== totalNumberOfBatches)
    return path.batchIncomplete();

  return path.batchComplete();
};
