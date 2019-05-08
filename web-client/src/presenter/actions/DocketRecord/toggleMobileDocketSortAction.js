import { state } from 'cerebral';

/**
 * toggles mobile docket sort to other option (byDate/byDateDesc)
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.sessionMetadata.docketRecordSort
 * @param {Object} providers.get the cerebral store used for getting state.sessionMetadata.docketRecordSort
 */
export const toggleMobileDocketSortAction = ({ store, get }) => {
  const currentSort = get(state.sessionMetadata.docketRecordSort);
  let newSort;
  if (currentSort === 'byDate') {
    newSort = 'byDateDesc';
  } else {
    newSort = 'byDate';
  }
  store.set(state.sessionMetadata.docketRecordSort, newSort);
};
