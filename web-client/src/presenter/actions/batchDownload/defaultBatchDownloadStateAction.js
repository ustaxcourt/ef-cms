import { state } from 'cerebral';

/**
 * set the state allow retry state based on props
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const defaultBatchDownloadStateAction = ({ props, store }) => {
  const { allowRetry } = props;

  store.set(state.batchDownloads, { allowRetry: !!allowRetry });
};
