import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the default tab for the edit order to generate
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setDefaultTabStateAction = ({ store }: ActionProps) => {
  store.set(state.createOrderTab, 'generate');
};
