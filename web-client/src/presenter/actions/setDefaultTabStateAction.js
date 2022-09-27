import { state } from 'cerebral';

/**
 * sets the default tab for the edit order to generate
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setDefaultTabStateAction = ({ store }) => {
  store.set(state.createOrderTab, 'generate');
};
