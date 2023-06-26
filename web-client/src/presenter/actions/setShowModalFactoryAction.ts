import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.modal.showModal to whatever is passed in the factory function
 * @param {string } showModal the value to set the modal to
 * @returns {Function} the primed action
 */
export const setShowModalFactoryAction = (showModal: string) => {
  /**
   * sets the state.modal.showModal to whatever was passed in the factory function
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store used for setting state.users
   */
  const setShowModalAction = ({ store }: ActionProps) => {
    store.set(state.modal.showModal, showModal);
  };

  return setShowModalAction;
};
