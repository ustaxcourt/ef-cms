import { state } from 'cerebral';

/**
 * sets the state.form.filersMap to empty object
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setDefaultFilersMapsAction = ({ store }) => {
  store.set(state.form.filersMap, {});
};
