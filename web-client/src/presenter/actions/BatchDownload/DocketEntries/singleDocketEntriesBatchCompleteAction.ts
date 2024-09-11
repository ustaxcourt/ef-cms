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

  const docketEtriesBatchDownload = get(state.docketEtriesBatchDownload);

  docketEtriesBatchDownload[uuid] = [
    ...(docketEtriesBatchDownload[uuid] || []),
    { index, url },
  ];

  store.set(state.docketEtriesBatchDownload, docketEtriesBatchDownload);

  const completedBatchCount = docketEtriesBatchDownload[uuid].length;
  if (completedBatchCount !== totalNumberOfBatches)
    return path.batchIncomplete();

  return path.batchComplete();
};
