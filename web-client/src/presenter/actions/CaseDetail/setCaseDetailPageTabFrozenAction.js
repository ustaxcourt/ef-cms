import { state } from 'cerebral';

/**
 * sets currentViewMetadata.caseDetail.frozen to true (prevents tabs from being set in state, or "freezes" their values)
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store function
 */
export const setCaseDetailPageTabFrozenAction = ({ store }) => {
  store.set(state.currentViewMetadata.caseDetail.frozen, true);
};
