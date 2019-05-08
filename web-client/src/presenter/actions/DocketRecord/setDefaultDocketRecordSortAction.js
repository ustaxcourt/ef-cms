import { state } from 'cerebral';

/**
 * sets state.sessionMetadata.docketRecordSort to its default value if the current caseId
 * is different than the state.sessionMetadata.caseId (last case the user was viewing
 * when they changed the default sort option)
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.sessionMetadata.docketRecordSort
 * @param {Object} providers.get the cerebral store used for getting state.sessionMetadata.docketRecordSort
 */
export const setDefaultDocketRecordSortAction = ({ store, get }) => {
  const newCaseId = get(state.caseDetail.caseId);
  const oldCaseId = get(state.sessionMetadata.caseId);

  if (newCaseId !== oldCaseId) {
    store.set(state.sessionMetadata.docketRecordSort, 'byDate');
  }
};
