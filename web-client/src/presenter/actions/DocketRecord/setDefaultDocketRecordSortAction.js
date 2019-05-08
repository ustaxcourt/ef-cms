import { state } from 'cerebral';

/**
 * toggles mobile docket sort to other option (byDate/byDateDesc)
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
