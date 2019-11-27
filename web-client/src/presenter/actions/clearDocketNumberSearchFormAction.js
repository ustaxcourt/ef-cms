import { state } from 'cerebral';

/**
 * sets the state.docketNumberSearchForm to an empty object
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearDocketNumberSearchFormAction = ({ store }) => {
  store.set(state.docketNumberSearchForm, {});
};
