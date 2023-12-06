import { state } from '@web-client/presenter/app.cerebral';

/**
 * Set the state value indicating if retrying downloading trial session
 *  cases is allowed
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const defaultBatchDownloadStateAction = ({
  props,
  store,
}: ActionProps) => {
  const { allowRetry } = props;

  store.set(state.batchDownloads, { allowRetry: !!allowRetry });
};
