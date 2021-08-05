import { state } from 'cerebral';

/**
 * set the state allow retry state based on props
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.get the cerebral get function used for getting state
 * @returns {object} the prop with the trail session id
 */
export const defaultBatchDownloadStateAction = ({ get, props, store }) => {
  const { allowRetry } = props;
  const { trialSessionId } = get(state.trialSession) || {};

  store.set(state.batchDownloads, { allowRetry: !!allowRetry });

  return { trialSessionId };
};
