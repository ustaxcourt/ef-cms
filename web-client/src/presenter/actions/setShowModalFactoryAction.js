import { state } from 'cerebral';

/**
 * sets the state.showModal to whatever is pass in the factory function
 *
 * @param {string } showModal the value to set the modal to
 * @returns {Function} the primed action
 */
export const setShowModalFactoryAction = showModal => {
  /**
   * sets the state.showModal to whatever was passed in the factory function
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store used for setting state.users
   */
  const setShowModalAction = ({ store }) => {
    store.set(state.showModal, showModal);
  };

  return setShowModalAction;
};
