import { state } from 'cerebral';

/**
 * sets caseDetailPage.frozen to false (enables caseDetailPage tabs to be set again, or "unfreezes" them)
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store function
 */
export const setCaseDetailPageTabUnfrozenAction = async ({ store }) => {
  store.unset(state.caseDetailPage.frozen);
};
