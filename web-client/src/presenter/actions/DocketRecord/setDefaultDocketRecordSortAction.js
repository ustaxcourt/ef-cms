import { state } from 'cerebral';

/**
 * sets state.sessionMetadata.docketRecordSort to its default value if the current caseId
 * is different than the state.sessionMetadata.caseId (last case the user was viewing
 * when they changed the default sort option)
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.sessionMetadata.docketRecordSort
 * @param {object} providers.get the cerebral store used for getting state.sessionMetadata.docketRecordSort
 */
export const setDefaultDocketRecordSortAction = ({ get, store }) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const hasSort = get(state.sessionMetadata.docketRecordSort[docketNumber]);

  if (!hasSort) {
    store.set(state.sessionMetadata.docketRecordSort[docketNumber], 'byDate');
  }
};
