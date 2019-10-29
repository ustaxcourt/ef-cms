import { state } from 'cerebral';

/**
 * sets the state.showModal to whatever is pass in the factory function
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.users
 * @param showModal
 * @param {object} providers.props the cerebral props object used for getting the props.users
 */
export const setShowModalFactoryAction = showModal => ({ store }) => {
  store.set(state.showModal, showModal);
};
