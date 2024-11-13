import { state } from '@web-client/presenter/app.cerebral';

/**
 * increments screenMetadata.page by one, saving to state
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function failure)
 */
export const incrementScreenMetadataPageAction = ({
  get,
  store,
}: ActionProps) => {
  const currentPage = get(state.screenMetadata.page) || 1;
  store.set(state.screenMetadata.page, currentPage + 1);
};
